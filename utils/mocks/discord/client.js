const { Collection } = require('discord.js');
const config = require('../../../config');
const User = require('./user');
const TextChannel = require('./text-channel');

// Client auto fills static values that is known to exist on the server through config.js
class Client {
  user = User.odinBot;
  #users = new Collection();
  #channels = new Collection();

  constructor(users = [], channels = []) {
    Object.values(config.users)
      .map((user) => new User({ id: user.id, username: user.name }))
      .forEach((user) => this.#users.set(user.id, user));

    Object.values(config.channels)
      .map((channel) => new TextChannel(channel.id, channel.name))
      .forEach((channel) => this.#channels.set(channel.id, channel));

    users.forEach((user) => {
      this.#users.set(user.id, user);
    });

    channels.forEach((channel) => {
      this.#channels.set(channel.id, channel);
    });

    // This makes sure odinBot user and the user in the collection is the same Object, otherwise client will fail equallity checks in the tests
    this.#users.set(this.user.id, this.user);
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
