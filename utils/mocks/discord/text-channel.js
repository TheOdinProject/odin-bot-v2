class TextChannel {
  constructor(id) {
    this.id = id;
    this.send = jest.fn(async (message) => message);
  }
}

module.exports = TextChannel;
