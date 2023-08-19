class MockRedisInstance {
  constructor() {
    this.store = {};
  }
  
  async lpush(keyName, entry) {
    if (!this.store[keyName]) {
      this.store[keyName] = [];
    }

    const standardizedEntry = typeof entry === "string" ? [entry] : entry;

    this.store[keyName].push(...standardizedEntry);
  }

  async lrange(keyName, start, end) {
    if (end === -1) {
      return this.store[keyName].slice(start).reverse();
    }
    return this.store[keyName].slice(start, end).reverse();
  }

  async del(keyName) {
    this.store[keyName] = undefined;
  }

  async lrem(keyName, _count, element) {
    this.store[keyName] = this.store[keyName].filter((entry) => entry !== element);
  }
}

const MockRedisService = {
  getInstance() {
    return new MockRedisInstance();
  },
};

module.exports = MockRedisService
