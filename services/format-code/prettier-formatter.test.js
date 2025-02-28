const prettier = require('prettier');
const prettierFormatter = require('./prettier-formatter');

jest.spyOn(prettier, 'format');

describe('prettierFormatter', () => {
  describe('when code block has supported lang', () => {
    const codeBlock = {
      lang: 'js',
      content: 'const a = 1;',
    };

    it('calls prettier.format method with correct arguments', async () => {
      prettier.format.mockImplementationOnce(async () => 'const a = 1;');
      await prettierFormatter(codeBlock);
      expect(prettier.format).toHaveBeenCalledWith('const a = 1;', {
        parser: 'babel',
      });
    });

    it('returns formatted code', async () => {
      prettier.format.mockImplementationOnce(async () => 'const a = 1;');
      expect(await prettierFormatter(codeBlock)).toEqual('const a = 1;');
    });
  });

  describe('when code block has unsupported lang', () => {
    const codeBlock = {
      lang: 'unsupported',
      content: 'const a = 1;',
    };

    it('throws error with expected message', () => {
      expect(async () => prettierFormatter(codeBlock)).rejects.toThrow(
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
      expect(async () => prettierFormatter(codeBlock)).rejects.toThrow(
        'Syntax Error',
      );
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
      expect(async () => prettierFormatter(codeBlock)).rejects.toThrow(
        'Error while formatting',
      );
    });
  });
});
