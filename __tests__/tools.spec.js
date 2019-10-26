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
    const modules = ['react', 'moment'];
    const dictionary = {
      react: [
        {
          url:
            'https://lib.baomitu.com/react-dom/16.10.1/umd/react.development.js',
        },
      ],
      moment: [
        {
          url: 'https://cdn.bootcss.com/moment.js/2.22.1/moment.min.js',
          integrity:
            'sha384-fYxN7HsDOBRo1wT/NSZ0LkoNlcXvpDpFy6WzB42LxuKAX7sBwgo7vuins+E1HCaw',
        },
      ],
    };
    const result = tools.createTree(modules, dictionary);

    expect(result).toMatchSnapshot();
  });
});
