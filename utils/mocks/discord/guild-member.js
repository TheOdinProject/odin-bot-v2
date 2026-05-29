const { botUserId } = require('../../../config');
const { Collection } = require('discord.js');
const User = require('./user');

class GuildMember {
  #roles = new Collection();
  constructor({ id, username, nickname, guild, roles = [] }) {
    this.user = new User({ id, username });
    this.nickname = nickname;
    this.guild = guild;
    this.kick = jest.fn(async (msg) => msg);
    this.send = jest.fn(async (msg) => msg);
    this.displayAvatarURL = () => 'image.jpg';

    roles.forEach((role) => {
      this.#roles.set(role.id, role);
    });
  }

  static get odinBot() {
    return new GuildMember({ id: botUserId });
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

  toString() {
    return this.user.toString();
  }
}

module.exports = GuildMember;
