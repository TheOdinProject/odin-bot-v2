const { Collection } = require('discord.js');
const { Member } = require('./mocks/discord').discordMock;
const { isAdmin } = require('./is-admin');

describe('isAdmin', () => {
  it('should return true if the user has an admin role', () => {
    const roles = new Collection().set('role-1', { name: 'core' });
    const member = Member({ roles });
    expect(isAdmin(member)).toBe(true);
  });

  it('should return false if the user does not have an admin role', () => {
    const roles = new Collection();
    const member = Member({ roles });
    expect(isAdmin(member)).toBe(false);
  });
});
