class Message {
  constructor({ author, member, attachments = { size: 0 } }) {
    this.author = author;
    this.member = member;
    this.attachments = attachments;
    this.delete = jest.fn();
  }
}

module.exports = Message;
