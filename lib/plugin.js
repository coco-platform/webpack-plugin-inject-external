/**
 * @description - @coco-platform/init-cli generated template
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// Native
// Scope
const defaultOptions = {
  verbose: false,
};

class InjectExternalPlugin {
  constructor(options = {}) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    compiler.hooks.compilation.tap('InjectExternal', (compilation) => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
        'InjectExternal',
        (structure, callback) => {
          callback(null, structure);
        }
      );
    });
  }
}

module.exports = InjectExternalPlugin;
