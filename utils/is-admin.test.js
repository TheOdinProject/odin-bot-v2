const { Member } = require('discord.js');
const { Collection } = require('@discordjs/collection');
const { isAdmin } = require('./is-admin'); // Adjust the path as necessary

jest.mock('discord.js', () => ({
  Member: jest.fn().mockImplementation((roles) => ({
    roles: {
      cache: roles,
    },
  })),
}));

describe('isAdmin', () => {
  it('should return true if the user has an admin role', () => {
    const memberMap = new Collection();
    memberMap.set('role-1', { name: 'core' });
    const member = Member(memberMap);
    expect(isAdmin(member)).toBe(true);
  });

  it('should return false if the user does not have an admin role', () => {
    const memberMap = new Collection();
    const member = Member(memberMap);
    expect(isAdmin(member)).toBe(false);
  });
});
