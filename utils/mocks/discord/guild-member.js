const { Collection } = require('discord.js');

class GuildMember {
  #roles = new Collection();

  constructor({ id, guild, roles = [], user }) {
    this.id = id;
    this.guild = guild;
    this.kick = jest.fn(async (msg) => msg);
    this.send = jest.fn(async (msg) => msg);
    this.user = user;

    roles.forEach((role) => {
      this.#roles.set(role.id, role);
    });

    this.displayAvatarURL = () => 'image.jpg';
  }

  get roles() {
    return {
      cache: this.#roles,
      add: (role) => this.#roles.set(role, role),
    };
  }
}

module.exports = GuildMember;
