const { Collection, Member } = require('discord.js');
const { isAdmin } = require('./is-admin');

jest.mock('discord.js', () => ({
  ...jest.requireActual('discord.js'),
  Member: jest.fn().mockImplementation((roles) => ({
    roles: {
      cache: roles,
    },
  })),
}));

describe('isAdmin', () => {
  it('should return true if the user has an admin role', () => {
    const memberCollection = new Collection();
    memberCollection.set('role-1', { name: 'core' });
    const member = Member(memberCollection);
    expect(isAdmin(member)).toBe(true);
  });

  it('should return false if the user does not have an admin role', () => {
    const memberCollection = new Collection();
    const member = Member(memberCollection);
    expect(isAdmin(member)).toBe(false);
  });
});
