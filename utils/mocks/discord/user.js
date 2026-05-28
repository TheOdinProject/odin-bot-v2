class User {
  constructor({ id, username }) {
    this.id = id;
    this.username = username;
  }

  toString() {
    return `<@${this.id}>`;
  }
}

module.exports = User;
