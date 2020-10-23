const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InjectExternalPlugin = require('../lib').default;

const target = path.resolve('../__tests__/__fixture__/bootcdn.externals.yml');
const configuration = {
  entry: path.resolve('../__tests__/__fixture__/index.js'),
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
      template: path.resolve('../__tests__/__fixture__/index.html'),
      inject: 'body',
    }),
    new InjectExternalPlugin({
      env: 'production',
      definition: target,
    }),
  ],
};
const compiler = webpack(configuration);

compiler.inputFileSystem = fs;
compiler.outputFileSystem = fs;

compiler.run((err) => {});
