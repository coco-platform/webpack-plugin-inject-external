/**
 * @description - @coco-platform/init-cli generated template
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

const _ = require('lodash');

/**
 * @typedef {object} Options
 *
 * @property {string} env - development, production
 * @property {string} definition - YAML content which describe external resources
 */

// internal
const tools = require('./tools');
// scope
const defaultOptions = {
  env: process.env.NODE_ENV || 'development',
  definition: '',
};

class InjectExternalPlugin {
  constructor(options = {}) {
    /**
     * @type {Options}
     * @todo - definition property is required
     */
    this.options = Object.assign({}, defaultOptions, options);
  }

  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    compiler.hooks.compilation.tap('InjectExternal', (compilation) => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
        'InjectExternal',
        (structure, callback) => {
          const externals = tools.findExternalModules(compilation);
          const { env, definition } = this.options;

          Promise.resolve(definition)
            .then((yaml) => tools.parseExternalDefinition(yaml, env))
            .then((dictionary) => tools.createTree(externals, dictionary))
            .then(({ head, body }) =>
              _.assign({}, structure, {
                head: [...head, ...structure.head],
                body: [...body, ...structure.body],
              })
            )
            .then((next) => callback(null, next))
            .catch((err) => callback(err));
        }
      );
    });
  }
}

module.exports = InjectExternalPlugin;
