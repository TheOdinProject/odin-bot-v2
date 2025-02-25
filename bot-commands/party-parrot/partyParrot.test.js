const command = require('./partyParrot');
const { randomInt } = require('../misc-features/helpers');

describe('/partyparrot', () => {
  it.each([
    ['party parrot'],
    ['/party parrot'],
    ['party_parrot'],
    ['/party_parrot'],
    ['/partyparrot'],
    ['oiseau'],
    ['/oiseau'],
    ['/partyparrot'],
  ])("'%s' triggers the callback", (string) => {
    expect(command.regex.test(string)).toBeTruthy();
  });

  it.each([
    ['part yparrot'],
    ['party'],
    ['parrot'],
    ['partiesparrot'],
    ['parrot party'],
    ['party pants parrot'],
    ['PARTY PARROT'],
    ['partying parrot'],
    ['parrot partying'],
    ['party-parrot'],
    [''],
    [' '],
    ['/ '],
  ])("'%s' does not trigger the callback", (string) => {
    expect(command.regex.test(string)).toBeFalsy();
  });

  it.each([
    ['hello /party parrot'],
    ['need me some /party parrot'],
    ['hey @odin-bot, teach me how to /party parrot'],
    ['/@odin-bot ^ /me /party_parrot /test$*'],
    ['this is a long test string with a randomly placed party parrot command'],
    ['/oiseaugrealkdmsfalnd'],
    ['someone/party_parrot'],
    ['/party parrot/xx'],
    ['/partyparrot*'],
    ['/partyparrot...'],
    ['^_/oiseau...'],
  ])("'%s' - the command can be anywhere in the string", (string) => {
    expect(command.regex.test(string)).toBeTruthy();
  });
});

// mock randomInt
jest.mock('./helpers');

describe('partyparrot snapshot', () => {
  it.each([
    ['party parrot!'],
    ['!partyparrot'],
    ['party_parrot!'],
    ['oiseau!'],
    ['!'],
  ])(
    'messages including an exclamation point always return the first index in the array',
    (string) => {
      expect(command.cb({ content: string })).toMatchSnapshot();
    },
  );

  it('when randomInt is mocked, the output remains the same', () => {
    // NOTE: if the length of the parrot array changes,
    // this for loop will need to be updated to reflect that change
    // TODO: Automatically grab length of Parrots array
    for (let i = 0; i < 14; i += 1) {
      randomInt.mockReturnValueOnce(i);

      expect(command.cb({ content: '' })).toMatchSnapshot();
    }
  });
});
