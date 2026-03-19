const { Collection } = require('discord.js');
const ODIN_BOT = require('./odin-bot');

class Guild {
  #members = new Collection().set(ODIN_BOT.id, ODIN_BOT);
  #channels = new Collection();
  #roles = new Collection().set('707225790546444288', { name: 'club-40' });

  // TODO?: Remove channels collection from Client mock as well? If no longer needed
  // TODO: Remove default empty channels array after old points.test.js removed
  // Only needed for that and no point refactoring those tests only to remove them soon
  constructor({ members, channels = [] }) {
    members.forEach((member) => {
      this.#members.set(member.id, member);
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

  get members() {
    return {
      cache: this.#members,
      fetch: (user) => user.toGuildMember(),
    };
  }

  get roles() {
    return {
      cache: this.#roles,
    };
  }
}

module.exports = Guild;
