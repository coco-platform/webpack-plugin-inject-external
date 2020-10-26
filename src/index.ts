/**
 * @description - @coco-platform/init-cli generated template
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// packages
import assert from 'assert';
import { Compiler } from 'webpack';
import { getHooks } from 'html-webpack-plugin';

// internal
import RequireHtmlWebpackPluginError from './exceptions/RequireHtmlWebpackPluginError';
import UnsupportHtmlWebpackPluginVersionError from './exceptions/UnsupportHtmlWebpackPluginVersionError';
import {
  createTree,
  parseExternalDefinition,
  findExternalModules,
} from './tools';

// interface
import { InjectExternalOptions } from './interface';

// scope
const defaultOptions = {
  env: process.env.NODE_ENV || 'development',
  definition: '',
};

class InjectExternalPlugin {
  private options: InjectExternalOptions;

  constructor(options: InjectExternalOptions) {
    assert(options.definition, 'the external resource mappings required');

    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  apply(compiler: Compiler): void {
    compiler.hooks.compilation.tap('InjectExternal', (compilation) => {
      const [HtmlWebpackPluginInstance] = compiler.options.plugins.filter(
        (plugin) => plugin.constructor.name === 'HtmlWebpackPlugin'
      );

      if (!HtmlWebpackPluginInstance) {
        // awkward, WebpackError not exported
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        compilation.errors.push(new RequireHtmlWebpackPluginError());
      }
      // pre-v4 HtmlWebpackPlugin
      else if (
        Reflect.has(compilation.hooks, 'htmlWebpackPluginAlterAssetTags')
      ) {
        // awkward, WebpackError not exported
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        compilation.errors.push(new UnsupportHtmlWebpackPluginVersionError());
      } else {
        // get available hooks directly
        const hooks = getHooks(compilation);

        hooks.alterAssetTagGroups.tapAsync(
          'InjectExternalPlugin',
          (assetTagGroups, callback) => {
            const { env, definition } = this.options;
            const externals = findExternalModules(compilation);

            Promise.resolve()
              .then(() => parseExternalDefinition(definition, env))
              .then((dictionary) => {
                return createTree(externals, dictionary, compilation);
              })
              .then(({ headTags, bodyTags }) => ({
                ...assetTagGroups,
                headTags: [...headTags, ...assetTagGroups.headTags],
                bodyTags: [...bodyTags, ...assetTagGroups.bodyTags],
              }))
              .then((alteredAssetTagGroups) =>
                callback(null, alteredAssetTagGroups)
              )
              .catch((err) => callback(err));
          }
        );
      }
    });
  }
}

export default InjectExternalPlugin;
