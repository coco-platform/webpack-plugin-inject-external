// package
// eslint-disable-next-line
const WebpackError = require('webpack/lib/WebpackError');

class UnsupportedResourceExternsionWarning extends WebpackError {
  constructor(url: string) {
    super();

    // copy from official warning class
    this.name = 'UnsupportedResourceExternsionWarning';
    this.message = `InjectExternalPlugin: the extension of ${url} not supported yet, which will be skiped`;

    // copy from official warning class
    Error.captureStackTrace(this, this.constructor);
  }
}

export default UnsupportedResourceExternsionWarning;
