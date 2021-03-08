const { generateMentions } = require('./mockData');

describe('Generate Mentions', () => {
  it('correct number of mentions are generated', () => {
    expect(generateMentions(0).mentions.users.array().length).toEqual(0);
    expect(generateMentions(1).mentions.users.array().length).toEqual(1);
    expect(generateMentions(2).mentions.users.array().length).toEqual(2);
    expect(generateMentions(10).mentions.users.array().length).toEqual(10);
  });
});
