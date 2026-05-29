class User {
  constructor({ id, username }) {
    this.id = id;
    this.username = username;
  }

  get displayName() {
    return this.username;
  }

  toString() {
    return `<@${this.id}>`;
  }
}

module.exports = User;
