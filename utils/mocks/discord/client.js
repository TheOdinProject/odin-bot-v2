const { Collection } = require('discord.js');
const ODIN_BOT = require('./odin-bot');

class Client {
  user = ODIN_BOT;
  #users = new Collection().set(this.user.id, this.user);
  #channels = new Collection();

  // TODO: Remove most things when old award-points removed
  // New award-points only needs client.user for bot ClientUser
  // will use guild instance for members/channels/roles instead
  constructor({ users = [], channels = [] }) {
    users.forEach((user) => {
      this.#users.set(String(user.id), user);
    });
    channels.forEach((channel) => {
      this.#channels.set(channel.id, channel);
    });
  }

  get channels() {
    return {
      cache: this.#channels,
    };
  }

  get users() {
    return {
      cache: this.#users,
    };
  }
}

module.exports = Client;
