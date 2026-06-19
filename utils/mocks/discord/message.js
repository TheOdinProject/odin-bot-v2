class Message {
  constructor({ author, member, channelId, attachments = { size: 0 } }) {
    this.author = author;
    this.member = member;
    this.channelId = channelId;
    this.attachments = attachments;
    this.delete = jest.fn();

    this.react = jest.fn(async (msg) => msg);
    this.send = jest.fn(async (msg) => msg);
    this.delete = jest.fn(async (msg) => msg);
  }
}

module.exports = Message;
