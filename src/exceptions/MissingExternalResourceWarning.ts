// package
// eslint-disable-next-line
const WebpackError = require('webpack/lib/WebpackError');

class MissingExternalResourceWarning extends WebpackError {
  constructor(module: string) {
    super();

    // copy from official warning class
    this.name = 'MissingExternalResourceWarning';
    this.message = `InjectExternalPlugin: Library --> ${module} marked as external, but have no related resource`;

    // copy from official warning class
    Error.captureStackTrace(this, this.constructor);
  }
}

export default MissingExternalResourceWarning;
