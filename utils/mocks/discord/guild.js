const { Collection } = require('discord.js');
const ODIN_BOT = require('./odin-bot');

class Guild {
  #members = new Collection().set(ODIN_BOT.id, ODIN_BOT);
  #roles = new Collection().set(1, { name: 'club-40' });

  contructor({ members }) {
    members.forEach((member) => {
      this.#members.set(member.id, member);
    });
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
