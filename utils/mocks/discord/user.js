const { users } = require('../../../config');

class User {
  constructor({ id, username, bot }) {
    this.id = id;
    this.username = username;
    this.bot = bot;

    this.send = jest.fn(async (msg) => msg);
    this.displayAvatarURL = () => 'image.jpg';
  }

  static get odinBot() {
    return new User({
      id: users.odinBot.id,
      username: users.odinBot.name,
      bot: true,
    });
  }

  get displayName() {
    return this.username;
  }

  toString() {
    return `<@${this.id}>`;
  }
}

module.exports = User;
