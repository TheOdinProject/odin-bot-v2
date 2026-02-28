const GuildMember = require('./guild-member');

class User {
  #roles;

  constructor({ id, points, roles = [] }) {
    this.id = id;
    this.points = points;
    this.#roles = roles;
  }

  toGuildMember() {
    return new GuildMember({ roles: this.#roles });
  }

  toString() {
    return `<@${this.id}>`;
  }
}

module.exports = User;
