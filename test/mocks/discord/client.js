const { botUserId } = require('../../../config');
const { Collection } = require('discord.js');
const User = require('./user');

class Client {
  user = new User({ id: botUserId });
  #users = new Collection().set(this.user.id, this.user);
  #channels = new Collection();

  constructor({ users, channels }) {
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
