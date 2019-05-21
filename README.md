# webpack-plugin-inject-external

![Build Status](https://img.shields.io/travis/coco-platform/webpack-plugin-inject-external/master.svg?style=flat)
[![Coverage Status](https://coveralls.io/repos/github/coco-platform/webpack-plugin-inject-external/badge.svg?branch=master)](https://coveralls.io/github/coco-platform/webpack-plugin-inject-external?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/coco-platform/webpack-plugin-inject-external.svg)](https://greenkeeper.io/)
![Package Dependency](https://david-dm.org/coco-platform/webpack-plugin-inject-external.svg?style=flat)
![Package DevDependency](https://david-dm.org/coco-platform/webpack-plugin-inject-external/dev-status.svg?style=flat)

## Usage

```shell
# npm
npm install @coco-platform/webpack-plugin-inject-external --only=dev;
# yarn
yarn add @coco-platform/webpack-plugin-inject-external --dev;
```

## Options

```javascript
/**
 * @typedef {object} Options
 *
 * @property {string} env - development, production or other environment alias
 * @property {string} definition - YAML file path, whose contents describe external resources
 */
```

## Usage

Then config the webpack:

```javascript
const configuration = {
  entry: path.resolve(__dirname, '__fixture__', 'index.js'),
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '__fixture__', 'index.html'),
      inject: 'body',
    }),
    new InjectExternalPlugin({
      env: 'development',
      definition: 'bootcdn.externals.yml,
    }),
  ],
};
```

Finally output:

```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Webpack Plugin</title>``
</head>
<body>
  <script type="text/javascript" src="https://cdn.bootcss.com/jquery/3.3.1/jquery.js" crossorigin="anonymous"></script>
  <script type="text/javascript" src="https://cdn.bootcss.com/lodash.js/4.17.10/lodash.js" crossorigin="anonymous"></script>
  <script type="text/javascript" src="/main.js"></script>
</html>
```

## License

MIT
