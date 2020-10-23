/* eslint-disable import/prefer-default-export */
/**
 * @description - provide several tool for core implement
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import path from 'path';
import fs from 'fs';
import { isPlainObject } from 'is-what';
import { parse } from 'yaml';
import { Compilation, Module, ExternalModule } from 'webpack';
import { createHtmlTagObject, HtmlTagObject } from 'html-webpack-plugin';

// internal
import MissingExternalResourceWarning from './exceptions/MissingExternalResourceWarning';
import UnsupportedResourceExternsionWarning from './exceptions/UnsupportedResourceExternsionWarning';

// interface
import {
  AlterAssetTagGroupsParts,
  ExternalDictionary,
  Linkage,
  SplitedExternalModules,
} from './interface';

/**
 * @description - avoid inline type misunderstand
 *
 * @param {Module} module
 *
 * @returns {boolean}
 */
function isExternalModule(module: Module): module is ExternalModule {
  return module instanceof ExternalModule;
}

/**
 * @description - find all external modules
 *
 * @returns {string[]}
 */
export function findExternalModules(compilation: Compilation): string[] {
  return (
    Array.from(compilation.modules)
      .filter<ExternalModule>(isExternalModule)
      // ignore specific relative external path
      .filter((module) => !module.userRequest.startsWith('.'))
      .map((module) => module.userRequest)
  );
}

/**
 * @description - parse yaml string into standard plugin recognizable hashMap
 *
 * @param {string} definition - yaml syntax external request mappings
 * @param {Environment} [env=development]
 *
 * @return {ExternalDictionary}
 */
export function parseExternalDefinition(
  definition: string,
  env: string
): ExternalDictionary {
  const location = path.resolve(process.cwd(), definition);
  const incomeExternalDefinitionContent = fs.readFileSync(location, 'utf-8');
  const incomeExternalDefinition = parse(incomeExternalDefinitionContent);

  const availableEnv = ['development', 'production'];
  const currentEnv = availableEnv.includes(env) ? env : 'development';
  const emptyExternalDefinition = {
    library: [],
    environment: {},
  };
  const { library, environment } = isPlainObject(incomeExternalDefinition)
    ? incomeExternalDefinition
    : emptyExternalDefinition;
  const dedicated = environment[currentEnv] || [];
  // merge common resource and environment specific resource
  const resources = Array.isArray(library)
    ? [...library, ...dedicated]
    : [...dedicated];

  return (
    resources
      // unify linkage into resource array
      .map((resource) => {
        // conver single linkage into array linkage
        const linkage = Array.isArray(resource.linkage)
          ? resource.linkage
          : [resource.linkage];

        // convert string literal into object literal
        const compoundLinkage = linkage.map((item) =>
          isPlainObject(item) ? item : { url: item }
        );

        return { ...resource, linkage: compoundLinkage };
      })
      .reduce(
        (acc, resource) => ({
          ...acc,
          [resource.name]: resource.linkage,
        }),
        {}
      )
  );
}

/**
 * @description - split externals into hits and missing
 *
 * @param {ExternalDictionary} dictionary
 *
 * @returns {SplitedExternalModules}
 */
export function splitExternalModules(
  externals: string[],
  dictionary: ExternalDictionary
): SplitedExternalModules {
  const acc: SplitedExternalModules = {
    hits: [],
    missings: [],
  };

  externals.forEach((external) => {
    if (Reflect.has(dictionary, external)) {
      acc.hits.push(external);
    } else {
      acc.missings.push(external);
    }
  });

  return acc;
}

/**
 * @description - generate tag structure for webpack-plugin-html
 *
 * @param {string[]>} hits - external modules which match definitions
 * @param {ExternalDictionary} dictionary
 *
 * @return {AlterAssetTagGroupsParts}
 */
export function createTree(
  externals: string[],
  dictionary: ExternalDictionary,
  compilation: Compilation
): AlterAssetTagGroupsParts {
  const headTags: HtmlTagObject[] = [];
  const bodyTags: HtmlTagObject[] = [];
  const LinkExtension = /\.css$/;
  const ScriptExtension = /\.js$/;

  const { hits, missings } = splitExternalModules(externals, dictionary);

  missings.forEach((missing) => {
    compilation.warnings.push(
      // awkward, WebpackError not exported
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new MissingExternalResourceWarning(missing)
    );
  });

  /* eslint-disable no-console */
  hits
    .reduce<Linkage[]>((acc, module) => [...acc, ...dictionary[module]], [])
    .forEach((resource) => {
      if (LinkExtension.test(resource.url)) {
        const { url, ...rest } = resource;
        const attributes = {
          ...rest,
          href: url,
          rel: 'stylesheet',
          type: 'text/css',
        };

        headTags.push(createHtmlTagObject('link', attributes));
      } else if (ScriptExtension.test(resource.url)) {
        const { url, ...rest } = resource;
        const attributes = {
          ...rest,
          src: resource.url,
          type: 'text/javascript',
          crossorigin: 'anonymous',
        };

        bodyTags.push(createHtmlTagObject('script', attributes));
      } else {
        const warning = new UnsupportedResourceExternsionWarning(resource.url);
        // awkward, WebpackError not exported
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        compilation.warnings.push(warning);
      }
    });

  return { headTags, bodyTags };
  /* eslint-enable no-console */
}
