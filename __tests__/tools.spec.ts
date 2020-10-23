/**
 * @description - tools unit tests
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// packages
import path from 'path';
// internal
import { parseExternalDefinition, createTree } from '../src/tools';

describe('tools suits', () => {
  it('should parse standard externals definition', () => {
    const target = path.resolve(
      __dirname,
      '__fixture__',
      'bootcdn.externals.yml'
    );

    expect(parseExternalDefinition(target, 'development')).toMatchSnapshot();
    expect(parseExternalDefinition(target, 'production')).toMatchSnapshot();
  });

  it('should create standard HTML AST', () => {
    const modules = ['react', 'moment'];
    const compilations = {
      wanings: {
        push: jest.fn(),
      },
    };
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
    /* @ts-ignore */
    const result = createTree(modules, dictionary, compilations);

    expect(result).toMatchSnapshot();
    expect(compilations.wanings.push).not.toHaveBeenCalled();
  });
});
