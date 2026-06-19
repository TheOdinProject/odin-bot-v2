const { channels } = require('../../../config');

class TextChannel {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.send = jest.fn(async (msg) => msg);
  }

  static get club40() {
    return new TextChannel(channels.club40.id, channels.club40.name);
  }

  static get botSpamPlayground() {
    return new TextChannel(
      channels.botSpamPlayground.id,
      channels.botSpamPlayground.name,
    );
  }

  static get introductions() {
    return new TextChannel(
      channels.introductions.id,
      channels.introductions.name,
    );
  }

  static get gettingHired() {
    return new TextChannel(
      channels.gettingHired.id,
      channels.gettingHired.name,
    );
  }

  static get faq() {
    return new TextChannel(channels.faq.id, channels.faq.name);
  }

  static get wslHelp() {
    return new TextChannel(channels.wslHelp.id, channels.wslHelp.name);
  }

  static get contactModerators() {
    return new TextChannel(
      channels.contactModerators.id,
      channels.contactModerators.name,
    );
  }

  static get rules() {
    return new TextChannel(channels.rules.id, channels.rules.name);
  }

  static get moderationLog() {
    return new TextChannel(
      channels.moderationLog.id,
      channels.moderationLog.name,
    );
  }

  static get automodBlock() {
    return new TextChannel(
      channels.automodBlock.id,
      channels.automodBlock.name,
    );
  }
}

module.exports = TextChannel;
