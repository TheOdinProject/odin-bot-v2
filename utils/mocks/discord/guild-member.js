const { users } = require('../../../config');
const { Collection } = require('discord.js');
const User = require('./user');

class GuildMember {
  static ODIN_BOT = new GuildMember({
    id: users.odinBot.id,
    username: users.odinBot.name,
  });

  #roles = new Collection();
  constructor({ id, username, nickname, bot, guild, roles = [] }) {
    this.user = new User({ id, username, bot });
    this.nickname = nickname;
    this.guild = guild;

    this.kick = jest.fn();
    this.send = jest.fn();

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
      add: (role) => this.#roles.set(role.id, role),
    };
  }

  get displayName() {
    return this.nickname ?? this.user.displayName;
  }

  displayAvatarURL() {
    return this.user.displayAvatarURL();
  }

  toString() {
    return this.user.toString();
  }
}

module.exports = GuildMember;
