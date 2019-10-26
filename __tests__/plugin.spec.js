/* eslint-disable import/no-extraneous-dependencies, no-console */

// package
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Internal
const InjectExternalPlugin = require('../lib');

// Scope
const mfs = Reflect.construct(MemoryFS, []);

describe('plugin test suits', () => {
  it('should complete standard workflow', (done) => {
    const target = path.resolve(
      __dirname,
      '__fixture__',
      'bootcdn.externals.yml'
    );
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
          definition: target,
        }),
      ],
    };
    const compiler = webpack(configuration);
    const outputPath = `${configuration.output.path}/index.html`;

    compiler.inputFileSystem = fs;
    compiler.outputFileSystem = mfs;

    compiler.run((err) => {
      try {
        expect(err).toBeNull();
        expect(mfs.readFileSync(outputPath, 'utf8')).toMatchSnapshot();
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
