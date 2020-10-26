/* eslint-disable import/no-extraneous-dependencies, no-console */

// package
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// Internal
import InjectExternalPlugin from '../src';

// Scope
const mfs = new MemoryFS();

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

    compiler.run((err, stat) => {
      try {
        expect(err).toBeNull();
        expect(stat.hasErrors()).toBeFalsy();
        expect(mfs.readFileSync(outputPath, 'utf8')).toMatchSnapshot();
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
