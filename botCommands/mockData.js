const { Collection, ClientUser } = require('discord.js');

const generateMentions = (number) => {
  const collection = new Collection();

  for (let i = 0; i < number; i += 1) {
    collection.set(
      `User${i + 1}`,
      new ClientUser('client', {
        id: i + 1,
        username: `User${i + 1}`,
      }),
    );
  }

  return {
    mentions: {
      users: collection,
    },
  };
};

const generateLeaderData = (num) => {
  const arr = [];
  let id = 100;
  let points = 1000;

  for (let i = 0; i < num; i += 1) {
    arr.push({
      id,
      discord_id: id,
      points,
      displayName: `user${id}`,
    });
    id += 1;
    points -= 1;
  }

  return arr;
};

const generateLeaderDataWithMarkdown = (num) => {
  const exampleMarkdown = [
    '||test||',
    '*test*',
    '**test**',
    '`test`',
    '```test```',
  ];
  let markdownPointer = 0;
  const arr = [];
  let id = 100;
  let points = 1000;

  for (let i = 0; i < num; i += 1) {
    arr.push({
      id,
      discord_id: id,
      points,
      displayName: `user${id} ${exampleMarkdown[markdownPointer]}`,
    });
    id += 1;
    points -= 1;
    markdownPointer = markdownPointer + 1 > 3 ? 0 : markdownPointer + 1;
  }

  return arr;
};

module.exports = {
  generateMentions,
  generateLeaderData,
  generateLeaderDataWithMarkdown,
};
