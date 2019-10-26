/**
 * @description - provide several tool for core implement
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

const assert = require('assert');
const yaml = require('node-yaml');
const { isString, isPlainObject } = require('is-what');

/**
 * @description - find all external modules
 *
 * @param {Compilation} compilation
 *
 * @return {Array.<string>}
 */
function findExternalModules(compilation) {
  return (
    compilation.modules
      .filter((module) => module.external)
      .map((module) => module.userRequest)
      // ignore special relative external path
      .filter((name) => !name.startsWith('.'))
  );
}

/**
 * @description - parse yaml string into standard plugin recognizable hashMap
 *
 * @param {string} location - yaml syntax external request mappings
 * @param {string} [env=development]
 *
 * @return {object}
 */
function parseExternalDefinition(location, env) {
  const availableEnv = ['development', 'production'];
  const currentEnv = availableEnv.includes(env) ? env : 'development';
  const incomeExternalDefinition = yaml.readSync(location);
  const emptyExternalDefinition = {
    library: [],
    environment: {},
  };
  const { library, environment } = isPlainObject(incomeExternalDefinition)
    ? incomeExternalDefinition
    : emptyExternalDefinition;
  const dedicated = Reflect.get(environment, currentEnv) || [];
  // merge common resource and environment specific resource
  const resources = Array.isArray(library)
    ? [...library, ...dedicated]
    : [...dedicated];

  return (
    resources
      // unify linkage into resource array
      .map((resource) => {
        const linkage = Array.isArray(resource.linkage)
          ? resource.linkage
          : [resource.linkage];

        // normalize variants into compound form
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
 * @description - generate tag structure for webpack-plugin-html
 *
 * @param {Array.<string>} modules
 * @param {object} dictionary
 *
 * @return {{head,body}}
 */
function createTree(modules, dictionary) {
  const head = [];
  const body = [];
  const LinkExtension = /\.css$/;
  const ScriptExtension = /\.js$/;

  /* eslint-disable no-console */
  modules
    .filter((module) => {
      const valid = Reflect.has(dictionary, module);
      const warning = ` InjectExternalPlugin: Library --> ${module} marked as external, but have no related resource`;

      assert.ok(valid, warning);

      return valid;
    })
    .reduce((acc, module) => [...acc, ...Reflect.get(dictionary, module)], [])
    .forEach((resource) => {
      if (LinkExtension.test(resource.url)) {
        const baseAttributes = {
          rel: 'stylesheet',
          type: 'text/css',
          href: resource.url,
        };

        head.push({
          tagName: 'link',
          closeTag: true,
          attributes: isString(resource.integrity)
            ? { ...baseAttributes, integrity: resource.integrity }
            : baseAttributes,
        });
      }

      if (ScriptExtension.test(resource.url)) {
        const baseAttributes = {
          type: 'text/javascript',
          src: resource.url,
          crossorigin: 'anonymous',
        };

        body.push({
          tagName: 'script',
          closeTag: true,
          attributes: isString(resource.integrity)
            ? { ...baseAttributes, integrity: resource.integrity }
            : baseAttributes,
        });
      }
    });

  return { head, body };
  /* eslint-enable no-console */
}

module.exports = {
  findExternalModules,
  parseExternalDefinition,
  createTree,
};
