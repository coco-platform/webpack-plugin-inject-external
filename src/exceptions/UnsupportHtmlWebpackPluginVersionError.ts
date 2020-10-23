// package
// eslint-disable-next-line
const WebpackError = require('webpack/lib/WebpackError');

class UnsupportHtmlWebpackPluginVersionError extends WebpackError {
  constructor() {
    super();

    // copy from official warning class
    this.name = 'UnsupportHtmlWebpackPluginVersionWarning';
    this.message =
      'InjectExternalPlugin: compilation.hooks.htmlWebpackPluginAlterAssetTags not implemented anymore, upgrade html-webpack-plugin instead';

    // copy from official warning class
    Error.captureStackTrace(this, this.constructor);
  }
}

export default UnsupportHtmlWebpackPluginVersionError;
