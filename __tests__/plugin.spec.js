/* eslint-disable import/no-extraneous-dependencies, no-console */

// Native
const fs = require('fs');
const path = require('path');

// External
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const _ = require('lodash');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Internal
const InjectExternalPlugin = require('../lib');

// Scope
const mfs = Reflect.construct(MemoryFS, []);
const configuration = {
  entry: path.resolve(__dirname, '__fixture__', 'index.js'),
  resolve: {
    extensions: ['.js', '.css'],
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  externals: {
    lodash: '_',
    jquery: 'jQuery',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '__fixture__', 'index.html'),
      inject: 'body',
    }),
  ],
};

describe('plugin test suits', () => {
  it('should complete standard workflow', (done) => {
    const target = path.resolve(
      __dirname,
      '__fixture__',
      'bootcdn.externals.yml'
    );
    const contents = fs.readFileSync(target, { encoding: 'utf8' });
    const dedicatedConfiguration = _.assign({}, configuration, {
      plugins: [
        ...configuration.plugins,
        new InjectExternalPlugin({
          env: 'development',
          definition: contents,
        }),
      ],
    });
    const compiler = webpack(dedicatedConfiguration);
    const outputPath = `${configuration.output.path}/index.html`;

    compiler.inputFileSystem = fs;
    compiler.outputFileSystem = mfs;

    compiler.run((err) => {
      try {
        const content = mfs.readFileSync(outputPath, 'utf8');

        expect(err).toBeNull();
        expect(content).toMatchSnapshot();
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
