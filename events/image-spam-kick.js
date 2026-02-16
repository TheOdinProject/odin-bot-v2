const { Events } = require('discord.js');
const config = require('../config');

async function logKick(member) {
  const channelID = config.channels.moderationLogChannelId;
  const channel = await member.guild.channels.fetch(channelID);
  if (channel == null) {
    throw new Error(`No channel with the ID ${channelID} was found.`);
  }

  const embed = {
    timestamp: `${new Date().toISOString()}`,
    color: 15747399,
    footer: {
      text: `ID: ${member.id}`,
    },
    author: {
      name: `Kick | ${member.username}`,
      icon_url: `${member.displayAvatarURL()}`,
    },
    fields: [
      {
        value: `<@${member.id}>`,
        name: 'User',
        inline: true,
      },
      {
        value: 'User has been kicked, recieved auto mute after images spam.',
        name: 'Reason',
        inline: true,
      },
    ],
  };

  channel.send({ embeds: [embed] });
}

async function handleEvent(oldMemberState, newMemberState) {
  const mutedID = config.roles.muted;
  if (
    oldMemberState.roles.cache.get(mutedID) != null ||
    newMemberState.roles.cache.get(mutedID) == null
  ) {
    return;
  }

  await newMemberState.send(
    `You have been kicked from the Odin Project Discord server for sending multiple images in short session. If this account is compromised, please follow the steps linked in this [Discord support article about securing your account](https://support.discord.com/hc/en-us/articles/24160905919511-My-Discord-Account-was-Hacked-or-Compromised). Once your account is secure, feel free to rejoin the server`,
  );

  await logKick(newMemberState);
  await newMemberState.kick(
    'Image spam, account flagged for being compromised',
  );
}

module.exports = {
  name: Events.GuildMemberUpdate,
  execute: () => async (oldMemberState, newMemberState) => {
    try {
      await handleEvent(oldMemberState, newMemberState);
    } catch (e) {
      console.error(e);
    }
  },
};
