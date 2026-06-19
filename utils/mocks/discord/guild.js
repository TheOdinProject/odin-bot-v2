const { Collection } = require('discord.js');
const config = require('../../../config');
const GuildMember = require('./guild-member');
const Role = require('./role');
const TextChannel = require('./text-channel');

// Guild auto fills static values that is known to exist on the server through config.js
class Guild {
  #membersCollection = new Collection();
  #roles = new Collection();
  #channels = new Collection();

  constructor(members = [], channels = []) {
    Object.values(config.users)
      .map((user) => new GuildMember({ id: user.id, username: user.name }))
      .forEach((member) => this.#membersCollection.set(member.id, member));

    members.forEach((member) => {
      this.#membersCollection.set(member.id, member);
    });

    Object.values(config.channels)
      .map((channel) => new TextChannel(channel.id, channel.name))
      .forEach((channel) => this.#channels.set(channel.id, channel));

    Object.values(config.roles)
      .map((role) => new Role(role.id, role.name))
      .forEach((role) => this.#roles.set(role.id, role));

    channels.forEach((channel) => {
      this.#channels.set(channel.id, channel);
    });

    // Members cannot be a getter, otherwise ban, jest.fn() will be new object everytime.
    this.members = {
      cache: this.#membersCollection,
      // TODO: After points overhaul, update to only call it using user id and not user object
      fetch: (user) => this.#membersCollection.get(user.id),
      ban: jest.fn(),
    };
  }

  get channels() {
    return {
      cache: this.#channels,
      fetch: (id) => this.#channels.get(id),
      delete: (id) => this.#channels.delete(id),
    };
  }

  get roles() {
    return {
      cache: this.#roles,
    };
  }
}

module.exports = Guild;
