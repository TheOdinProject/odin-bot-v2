const GuildMember = require('./guild-member');

class User {
  #roles;
  constructor({ id, points, roles = [], username }) {
    this.id = id;
    this.username = username;
    this.points = points;
    this.#roles = roles;
  }

  toGuildMember() {
    return new GuildMember({ roles: this.#roles, user: this });
  }

  toString() {
    return `<@${this.id}>`;
  }
}

module.exports = User;
