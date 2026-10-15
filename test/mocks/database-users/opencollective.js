const config = require('../../../config');
const { GuildMember, Role } = require('../discord');

const backerRole = new Role(config.roles.backer, 'backer');

module.exports = {
  nonBacker: {
    member: new GuildMember({ id: '0', username: 'Member' }),
    opencollectiveUsername: 'member',
  },
  backerWithRole: {
    member: new GuildMember({
      id: '1',
      username: 'BackerWithRole',
      roles: [backerRole],
    }),
    opencollectiveUsername: 'backer',
  },
  backerWithoutRole: {
    member: new GuildMember({
      id: '2',
      username: 'BackerWithoutRole',
    }),
    opencollectiveUsername: 'backer',
  },
};
