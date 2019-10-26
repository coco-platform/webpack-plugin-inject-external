/**
 * @description - @coco-platform/init-cli generated template
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

/**
 * @typedef {object} InjectExternalOptions
 *
 * @property {string} env - development, production
 * @property {string} definition - YAML content file location which describe external resources
 */

// packages
const path = require('path');
const assert = require('assert');
const tools = require('./tools');
// scope
const defaultOptions = {
  env: process.env.NODE_ENV || 'development',
  definition: '',
};

class InjectExternalPlugin {
  /**
   * @param {InjectExternalOptions} options
   */
  constructor(options = {}) {
    assert(options.definition, 'the external resource mappings required');

    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    compiler.hooks.compilation.tap('InjectExternal', (compilation) => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
        'InjectExternalPluginAlterAssetTags',
        (structure, callback) => {
          const externals = tools.findExternalModules(compilation);
          const { env, definition } = this.options;
          // convert relative location into absolute location
          const raw = path.resolve(process.cwd(), definition);

          Promise.resolve(raw)
            .then((location) => tools.parseExternalDefinition(location, env))
            .then((dictionary) => tools.createTree(externals, dictionary))
            .then(({ head, body }) => ({
              ...structure,
              head: [...head, ...structure.head],
              body: [...body, ...structure.body],
            }))
            .then((next) => callback(null, next))
            .catch((err) => callback(err));
        }
      );
    });
  }
}

module.exports = InjectExternalPlugin;
