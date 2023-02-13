const prettier = require('prettier');
const prettierFormatter = require('./prettier-formatter');

jest.spyOn(prettier, 'format');

describe('prettierFormatter', () => {
  describe('when code block has supported lang', () => {
    const codeBlock = {
      lang: 'js',
      content: 'const a = 1;',
    };

    it('calls prettier.format method with correct arguments', () => {
      prettier.format.mockImplementationOnce(() => 'const a = 1;');
      prettierFormatter(codeBlock);
      expect(prettier.format).toHaveBeenCalledWith('const a = 1;', {
        parser: 'babel',
      });
    });

    it('returns formatted code', () => {
      prettier.format.mockImplementationOnce(() => 'const a = 1;');
      expect(prettierFormatter(codeBlock)).toEqual('const a = 1;');
    });
  });

  describe('when code block has unsupported lang', () => {
    const codeBlock = {
      lang: 'unsupported',
      content: 'const a = 1;',
    };

    it('throws error with expected message', () => {
      expect(() => prettierFormatter(codeBlock)).toThrow(
        'Language not supported.',
      );
    });
  });

  describe('when code block has content with syntax error', () => {
    const codeBlock = {
      lang: 'js',
      content: 'const a = 1;',
    };

    it('throws error with expected message', () => {
      prettier.format.mockImplementationOnce(() => {
        throw new SyntaxError('Syntax Error');
      });
      expect(() => prettierFormatter(codeBlock)).toThrow('Syntax Error');
    });
  });

  describe('when code block has content with other error', () => {
    const codeBlock = {
      lang: 'js',
      content: 'const a = 1;',
    };

    it('throws error with expected message', () => {
      prettier.format.mockImplementationOnce(() => {
        throw new Error('Other Error');
      });
      expect(() => prettierFormatter(codeBlock)).toThrow('Error while formatting');
    });
  });
});
