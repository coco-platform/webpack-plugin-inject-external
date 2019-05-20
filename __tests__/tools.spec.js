/**
 * @description - tools unit tests
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// packages
const path = require('path');
// internal
const tools = require('../lib/tools');

describe('tools suits', () => {
  it('should parse standard externals definition', () => {
    const target = path.resolve(
      __dirname,
      '__fixture__',
      'bootcdn.externals.yml'
    );

    expect(
      tools.parseExternalDefinition(target, 'development')
    ).toMatchSnapshot();

    expect(
      tools.parseExternalDefinition(target, 'production')
    ).toMatchSnapshot();
  });

  it('should create standard HTML AST', () => {
    const modules = ['lodash', 'bootstrap'];
    const dictionary = {
      lodash: ['https://cdn.bootcss.com/lodash.js/4.17.10/lodash.js'],
      bootstrap: [
        'https://cdn.bootcss.com/bootstrap/4.1.1/js/bootstrap.js',
        'https://cdn.bootcss.com/bootstrap/4.1.1/css/bootstrap.css',
      ],
    };
    const result = tools.createTree(modules, dictionary);

    expect(result).toMatchSnapshot();
  });
});
