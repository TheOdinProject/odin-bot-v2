const { Collection } = require('discord.js');

class GuildMember {
  #roles = new Collection();

  constructor({ roles }) {
    roles.forEach((role, index) => {
      this.#roles.set(index, { name: role });
    });
  }

  get roles() {
    return {
      cache: this.#roles,
      add: (role) => this.#roles.set(role, role),
    };
  }
}

module.exports = GuildMember;
