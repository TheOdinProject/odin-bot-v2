const { generateMentions } = require('./mockData');

describe('Generate Mentions', () => {
  it('correct number of mentions are generated', () => {
    expect(Array.from(generateMentions(0).mentions.users).length).toEqual(0);
    expect(Array.from(generateMentions(1).mentions.users).length).toEqual(1);
    expect(Array.from(generateMentions(2).mentions.users).length).toEqual(2);
    expect(Array.from(generateMentions(10).mentions.users).length).toEqual(10);
  });
});
