const { Collection } = require('discord.js');
const ODIN_BOT = require('./odin-bot');

class Guild {
  #members = new Collection().set(ODIN_BOT.id, ODIN_BOT);
  #roles = new Collection().set(1, { name: 'club-40' });
  #channels = new Collection();

  constructor({ members = [], channels = [], roles = [] }) {
    members.forEach((member) => {
      this.#members.set(member.id, member);
    });

    channels.forEach((channel) => {
      this.#channels.set(channel.id, channel);
    });

    roles.forEach((role) => {
      this.#roles.set(role.id, role);
    });
  }

  get channels() {
    return {
      cache: this.#channels,
      fetch: (id) => this.#channels.get(id),
    };
  }

  get members() {
    return {
      cache: this.#members,
      fetch: (user) => user.toGuildMember(),
    };
  }

  get roles() {
    return {
      cache: this.#roles,
    };
  }
}

module.exports = Guild;
