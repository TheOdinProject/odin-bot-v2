const prettier = require('prettier');

const prettierFormatter = (codeBlock) => {
  // source: https://prettier.io/docs/en/options.html#parser
  const langParser = {
    js: 'babel',
    javascript: 'babel',
    css: 'css',
    html: 'html',
    json: 'json',
    md: 'markdown',
    markdown: 'markdown',
    scss: 'scss',
    ts: 'typescript',
    typescript: 'typescript',
    yaml: 'yaml',
  };
  const { lang, content } = codeBlock;
  const parser = langParser[lang];

  if (!parser) {
    throw new Error('Language not supported.');
  }

  try {
    return prettier.format(content, { parser });
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new SyntaxError(`Syntax Error: ${error.message.split('\n')[0]}`);
    }
    throw new Error('Error while formatting');
  }
};

module.exports = prettierFormatter;
