const deductPoints = {
  name: 'deduct points',
  regex: /(?<!\S)<@!?(\d+)>\s?(--)(?!\S)/,
  cb: () =>
    'http://media.riffsy.com/images/636a97aa416ad674eb2b72d4a6e9ad6c/tenor.gif',
};

module.exports = deductPoints;
