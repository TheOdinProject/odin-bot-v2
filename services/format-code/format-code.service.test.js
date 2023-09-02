const discordjs = require('discord.js');
const FormatCodeService = require('./format-code.service');

// mock discord.js methods used in FormatCodeService
['EmbedBuilder',
  'ModalBuilder',
  'TextInputBuilder',
  'ActionRowBuilder'].forEach((method) => jest.spyOn(discordjs, method));

const mockPrettierFormatter = jest.fn();
jest.mock('./prettier-formatter', () => (...args) => mockPrettierFormatter(...args));

describe('FormatCodeService', () => {
  describe('sendFormattedCodeBlock', () => {
    describe('when formatCodeBlockContent throws error', () => {
      it('calls sendMessage with ephemeral message', async () => {
        jest.spyOn(FormatCodeService, 'formatCodeBlockContent');
        jest.spyOn(FormatCodeService, 'sendMessage');
        FormatCodeService.prototype.messageBuilder = jest.fn();
        const codeBlock = {
          lang: 'js',
          content: 'const a = 1;',
        };

        FormatCodeService.formatCodeBlockContent.mockImplementationOnce(() => {
          throw new Error('Error');
        });
        FormatCodeService.sendMessage.mockImplementationOnce(jest.fn());

        await FormatCodeService.sendFormattedCodeBlock('mockInteraction', codeBlock);
        expect(FormatCodeService.sendMessage).toHaveBeenCalledWith('mockInteraction', {
          content: 'Error',
          ephemeral: true,
        });
      });
    });

    describe('when formatCodeBlockContent does not throw error', () => {
      it('calls sendMessage', async () => {
        jest.spyOn(FormatCodeService, 'formatCodeBlockContent');
        jest.spyOn(FormatCodeService, 'sendMessage');
        const codeBlock = {
          lang: 'js',
          content: 'const a = 1;',
        };

        FormatCodeService.formatCodeBlockContent.mockImplementationOnce(() => 'const a = 1;');
        FormatCodeService.sendMessage.mockImplementationOnce(jest.fn());

        await FormatCodeService.sendFormattedCodeBlock('mockInteraction', codeBlock);
        // we do not concern ourselves with the exact arguments passed to sendMessage
        expect(FormatCodeService.sendMessage).toHaveBeenCalled();
      });
    });
  });

  describe('formatCodeBlockContent', () => {
    it('calls prettierFormatter with correct arguments', async () => {
      const codeBlock = {
        lang: 'js',
        content: 'const a = 1;',
      };

      await FormatCodeService.formatCodeBlockContent(codeBlock);
      expect(mockPrettierFormatter).toHaveBeenCalledWith(codeBlock);
    });

    describe('when prettierFormatter throws no error', () => {
      it('returns formatted code', async () => {
        const codeBlock = {
          lang: 'js',
          content: 'const a = 1;',
        };

        mockPrettierFormatter.mockImplementationOnce(async () => 'const a = 1;');
        expect(await FormatCodeService.formatCodeBlockContent(codeBlock)).toBe('const a = 1;');
      });
    });

    describe('when prettierFormatter throws error', () => {
      describe('when error is SyntaxError', () => {
        it('returns syntax error message', async () => {
          const codeBlock = {
            lang: 'js',
            content: 'const a = 1;',
          };
          mockPrettierFormatter.mockImplementationOnce(() => {
            throw new SyntaxError('Syntax Error');
          });
          expect(await FormatCodeService.formatCodeBlockContent(codeBlock)).toBe('Syntax Error');
        });
      });

      describe('when error is not SyntaxError', () => {
        it('throws error with expected message', () => {
          const codeBlock = {
            lang: 'js',
            content: 'const a = 1;',
          };
          mockPrettierFormatter.mockImplementationOnce(() => {
            throw new Error('Error');
          });
          expect(async () => FormatCodeService.formatCodeBlockContent(codeBlock)).rejects.toThrow('Error');
        });
      });
    });
  });

  describe('findCodeBlocks', () => {
    describe('when message has only 1 code block', () => {
      describe('when code block has lang', () => {
        const messageContent = '```js\nconst a = 1;\n```';

        it('returns an array of code block with correct lang', () => {
          const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);

          expect(codeBlocks).toHaveLength(1);
          expect(codeBlocks[0].lang).toBe('js');
        });

        it('returns an array of code block with correct content', () => {
          const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);

          expect(codeBlocks).toHaveLength(1);
          expect(codeBlocks[0].content).toBe('const a = 1;\n');
        });
      });

      describe('when code block does not have lang', () => {
        const messageContent = '```\nconst a = 1;\n```';

        it('returns an array of code block with undefined lang', () => {
          const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);

          expect(codeBlocks).toHaveLength(1);
          expect(codeBlocks[0].lang).toBeUndefined();
        });

        it('returns an array of code block with correct content', () => {
          const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);

          expect(codeBlocks).toHaveLength(1);
          expect(codeBlocks[0].content).toBe('const a = 1;\n');
        });
      });
    });

    describe('when message has multiple code blocks', () => {
      describe('when code blocks have lang', () => {
        const messageContent = '```js\nconst a = 1;\n```\n```html\n<p>hello</p>\n```';

        it('returns an array of code blocks with correct lang', () => {
          const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);

          expect(codeBlocks).toHaveLength(2);
          expect(codeBlocks[0].lang).toBe('js');
          expect(codeBlocks[1].lang).toBe('html');
        });

        it('returns an array of code blocks with correct content', () => {
          const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);

          expect(codeBlocks).toHaveLength(2);
          expect(codeBlocks[0].content).toBe('const a = 1;\n');
          expect(codeBlocks[1].content).toBe('<p>hello</p>\n');
        });
      });

      describe('when some code blocks have lang', () => {
        const messageContent = '```\nconst a = 1;\n```\n```html\n<p>hello</p>\n```\n```css\nbody {\n  color: red;\n}\n```';

        it('returns an array of code blocks with correct lang', () => {
          const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);

          expect(codeBlocks).toHaveLength(3);
          expect(codeBlocks[0].lang).toBeUndefined();
          expect(codeBlocks[1].lang).toBe('html');
          expect(codeBlocks[2].lang).toBe('css');
        });

        it('returns an array of code blocks with correct content', () => {
          const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);

          expect(codeBlocks).toHaveLength(3);
          expect(codeBlocks[0].content).toBe('const a = 1;\n');
          expect(codeBlocks[1].content).toBe('<p>hello</p>\n');
          expect(codeBlocks[2].content).toBe('body {\n  color: red;\n}\n');
        });
      });

      describe('when code blocks do not have lang', () => {
        const messageContent = '```\nconst a = 1;\n```\n```\nconst b = 2;\nconst c = 3;\n```';

        it('returns an array of code blocks with undefined lang', () => {
          const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);

          expect(codeBlocks).toHaveLength(2);
          expect(codeBlocks[0].lang).toBeUndefined();
          expect(codeBlocks[1].lang).toBeUndefined();
        });

        it('returns an array of code blocks with correct content', () => {
          const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);

          expect(codeBlocks).toHaveLength(2);
          expect(codeBlocks[0].content).toBe('const a = 1;\n');
          expect(codeBlocks[1].content).toBe('const b = 2;\nconst c = 3;\n');
        });
      });
    });

    describe('when message has deformed code blocks', () => {
      it('returns an empty array', () => {
        const messageContent = '```js const a = 1```';

        const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);

        expect(codeBlocks).toHaveLength(0);
      });

      it('returns an empty array', () => {
        const messageContent = '```js const a = 1\n```';

        const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);

        expect(codeBlocks).toHaveLength(0);
      });

      it('returns an empty array', () => {
        const messageContent = 'text```js\nconst a = 1\n```';

        const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);

        expect(codeBlocks).toHaveLength(0);
      });
    });

    describe('when message has no code blocks', () => {
      it('returns an empty array', () => {
        const messageContent = 'text';

        const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);

        expect(codeBlocks).toHaveLength(0);
      });
    });

    describe('when message has code block', () => {
      describe('when there are three backticks in the code block', () => {
        const messageContent = '```js\nconst a ``` = 1;\n```';
        it('returns an array of code blocks with correct lang', () => {
          const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);
          expect(codeBlocks[0].lang).toBe('js');
        });

        it('returns an array of code blocks with correct content', () => {
          const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);
          expect(codeBlocks[0].content).toBe('const a ``` = 1;\n');
        });
      });

      describe('when there is a nested codeblock, so it must only consider outer code block', () => {
        const messageContent = '```js\nconst a = 1;\n```md\nhello\n```const function = ()=>{}\n```';
        it('returns an array of code blocks with correct lang', () => {
          const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);
          expect(codeBlocks[0].lang).toBe('js');
        });

        it('returns an array of code blocks with correct content', () => {
          const codeBlocks = FormatCodeService.findCodeBlocks(messageContent);
          expect(codeBlocks[0].content).toBe('const a = 1;\n```md\nhello\n```const function = ()=>{}\n');
        });
      });
    });
  });
});
