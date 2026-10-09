const command = require('./party-parrot');
const { randomInt } = require('../../utils/random-int');

jest.mock('../../utils/random-int');

function createInteraction() {
  return {
    reply: jest.fn(),
  };
}

describe('/partyparrot', () => {
  it('has the name "partyparrot"', () => {
    expect(command.data.name).toBe('partyparrot');
  });

  it.each(command.parrots.map((parrot, i) => [i, parrot]))(
    'replies with the parrot at index %i',
    async (i, parrot) => {
      randomInt.mockReturnValueOnce(i);
      const interaction = createInteraction();

      await command.execute(interaction);

      expect(randomInt).toHaveBeenCalledWith(command.parrots.length);
      expect(interaction.reply).toHaveBeenCalledWith(parrot);
    },
  );
});
