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
 * @property {string} env - development, production or other environment name
 * @property {string} definition - YAML file path, whose contents describe external resources
 */
```

## Configurations

`webpack-plugin-inject-external` use `yaml` config file, single external module define like below:

```typescript
interface CompoundLinkage {
  url: string;
  integrity: string; // required property within compound mode
}

type Linkage = string | string[] | CompoundLinkage | Array<CompoundLinkage>;

// single external module
type Module = {
  name: string;
  linkage: Linkage;
};
```

when external module reference the same resource within different environment:

```yaml
library:
  - name: 'web-animations-js'
    linkage: 'https://unpkg.com/web-animations-js@2.3.1/web-animations.min.js'
```

when external module reference different resource within different environment:

```yaml
environment:
  development:
    - name: 'react'
      linkage: 'https://cdn.bootcss.com/react/16.3.2/umd/react.development.js'
    - name: 'moment'
      linkage:
        - 'https://cdn.bootcss.com/moment.js/2.22.1/moment.js'
        - 'https://cdn.bootcss.com/moment.js/2.22.1/locale/zh-cn.js'
  production:
    - name: 'react'
      linkage:
        url: 'https://cdn.bootcss.com/react/16.3.2/umd/react.production.min.js'
        integrity: 'sha384-xH6t0qiGSnjsUirN+xJjNhsfepiFFyK/wHMjrqPu6OoxN8uDO454QqZx3Wcos7en'
```

## Usage

Then config the webpack:

```javascript
const configuration = {
  entry: path.resolve(__dirname, '__fixture__', 'index.js'),
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  externals: {
    moment: 'moment',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '__fixture__', 'index.html'),
      inject: 'body',
    }),
    new InjectExternalPlugin({
      env: 'production',
      definition: path.resolve(
        __dirname,
        '__fixture__',
        'bootcdn.externals.yml'
      ),
    }),
  ],
};
```

Finally output:

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Webpack Plugin</title>
  </head>
  <body>
    <script
      type="text/javascript"
      src="https://cdn.bootcss.com/moment.js/2.22.1/moment.min.js"
      crossorigin="anonymous"
      integrity="sha384-fYxN7HsDOBRo1wT/NSZ0LkoNlcXvpDpFy6WzB42LxuKAX7sBwgo7vuins+E1HCaw"
    ></script
    ><script
      type="text/javascript"
      src="https://cdn.bootcss.com/moment.js/2.22.1/locale/zh-cn.js"
      crossorigin="anonymous"
      integrity="sha384-XjUTsP+pYBX4Kwg40gPvhWcRGKZh9gUpDForgg5bwsnyNU+VabKhRX6XkyM6fLk4"
    ></script
    ><script type="text/javascript" src="/main.js"></script>
  </body>
</html>
```

## License

MIT
