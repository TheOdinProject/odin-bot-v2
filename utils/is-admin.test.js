const { Collection } = require('discord.js');
const { Member } = require('./mocks/discord').discordMock;
const { isAdmin } = require('./is-admin');

describe('isAdmin', () => {
  it.each([['core'], ['maintainer'], ['admin'], ['moderator']])(
    'returns true if the user has the "%s" role',
    (role) => {
      const roles = new Collection().set('role-1', { name: role });
      const member = Member({ roles });
      expect(isAdmin(member)).toBe(true);
    },
  );

  it('returns false if the user does not have an admin role', () => {
    const roles = new Collection();
    const member = Member({ roles });
    expect(isAdmin(member)).toBe(false);
  });
});
