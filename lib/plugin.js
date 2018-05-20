/**
 * @description - @coco-platform/init-cli generated template
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

const _ = require('lodash');

/**
 * @typedef {object} Options
 *
 * @property {string} env - development, production
 * @property {number} timeout - throw error after timeout
 * @property {string} definition - A url with YAML file which describe external resources
 */

// internal
const tools = require('./tools');
// scope
const defaultOptions = {
  env: process.env.NODE_ENV || 'development',
  timeout: 12000,
  definition:
    // eslint-disable-next-line max-len
    'https://gist.githubusercontent.com/bornkiller/a66ff80a5c811066dccb11811b734a49/raw/7e72c26a60158c5d13bf5f59c86881b3d07ddc08/bootcdn.externals.stable.yml',
  handleExternalModules: _.noop,
};

class InjectExternalPlugin {
  constructor(options = {}) {
    /**
     * @type {Options}
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
          const {
            env,
            definition,
            timeout,
            handleExternalModules,
          } = this.options;

          // just for quick unit test
          handleExternalModules(externals);

          tools
            .requestDefinition(definition, timeout)
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
