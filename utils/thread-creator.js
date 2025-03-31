const { ChannelType } = require('discord-api-types/v10');
const canOpenPrivateThread = require('./can-open-private-thread');

const ThreadCreator = () => ({
  new: async ({
    channel,
    isPrivate = true,
    name = 'Thread',
    members = [],
    messages = [],
  }) => {
    const threadType =
      canOpenPrivateThread(channel.guild.premiumTier) && isPrivate
        ? ChannelType.PrivateThread
        : ChannelType.PublicThread;

    const thread = await channel.threads.create({
      name,
      type: threadType,
    });

    // add all members in thread
    await Promise.all(
      members.map(async (m) => {
        await thread.members.add(m);
      }),
    );

    // send all messages in thread
    await Promise.all(
      messages.map(async (m) => {
        await thread.send(m);
      }),
    );

    return thread;
  },
});

module.exports = ThreadCreator;
