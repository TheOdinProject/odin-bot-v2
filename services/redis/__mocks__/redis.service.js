class MockRedisInstance {
  constructor() {
    this.store = {};
  }

  async rpush(keyName, entry) {
    if (!this.store[keyName]) {
      this.store[keyName] = [];
    }

    const standardizedEntry = typeof entry === 'string' ? [entry] : entry;

    this.store[keyName].push(...standardizedEntry);
  }

  async lrange(keyName, start, end) {
    if (end === -1) {
      return this.store[keyName]?.slice(start);
    }
    return this.store[keyName]?.slice(start, end);
  }

  async del(keyName) {
    this.store[keyName] = undefined;
  }

  async lrem(keyName, _count, element) {
    this.store[keyName] = this.store[keyName].filter(
      (entry) => entry !== element,
    );
  }

  async lpop(keyName) {
    return this.store[keyName].shift();
  }
}

const MockRedisService = {
  getInstance() {
    return new MockRedisInstance();
  },
};

module.exports = MockRedisService;
