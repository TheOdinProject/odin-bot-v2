class DuplicateIdsError extends Error {
  constructor(missingIDs) {
    super(`
Could not start Odin Bot locally. Each channel ID configured in config.js must be unique. The following IDs are duplicates:
${missingIDs.join('\n')}

You can modify what value the ID's are set to in the .env file. See .env for more information.`);

    this.name = 'DuplicateIdsError';
  }

  static checkForDuplicateIds(channels) {
    const channelsByID = Object.entries(channels).reduce(
      (acc, [key, value]) => {
        if (!Array.isArray(value)) {
          if (acc[value]) {
            acc[value].push(key);
          } else {
            acc[value] = [key];
          }
        }
        return acc;
      },
      {},
    );

    const duplicateKeys = Object.values(channelsByID)
      .filter((keys) => keys.length > 1)
      .flat();

    return duplicateKeys;
  }
}

module.exports = DuplicateIdsError;
