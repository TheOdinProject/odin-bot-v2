const { Collection } = require('discord.js');
const User = require('./user');

class GuildMember {
  #roles = new Collection();

  constructor({ id, username, guild, roles = [] }) {
    this.user = new User({ id, username });
    this.guild = guild;
    this.kick = jest.fn(async (msg) => msg);
    this.send = jest.fn(async (msg) => msg);
    this.displayAvatarURL = () => 'image.jpg';

    roles.forEach((role) => {
      this.#roles.set(role.id, role);
    });
  }

  get id() {
    return this.user.id;
  }

  get roles() {
    return {
      cache: this.#roles,
      add: (role) => this.#roles.set(role, role),
    };
  }
}

module.exports = GuildMember;
