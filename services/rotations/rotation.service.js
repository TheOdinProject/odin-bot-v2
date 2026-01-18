const { escapeMarkdown } = require('discord.js');
const RedisService = require('../redis');

class RotationService {
  constructor(keyName, rotationName) {
    this.keyName = keyName;
    this.rotationName = rotationName;
    this.redis = RedisService.getInstance();
  }

  async #getQueue() {
    const members = await this.redis.lrange(this.keyName, 0, -1);
    return members;
  }

  async #addMembers(memberIds) {
    const queue = await this.#getQueue();

    const newMemberIds = memberIds.filter((id) => !queue?.includes(id));

    if (newMemberIds.length > 0) {
      await this.redis.rpush(this.keyName, newMemberIds);
    }

    return newMemberIds;
  }

  static #getFormattedPings(memberIds) {
    return memberIds.reduce((acc, id) => `${acc} <@${id}>`, '');
  }

  async #getDisplayNames(members, server) {
    this.displayNames = members.map(async (memberId) => {
      const member = await server.members.fetch(memberId);
      return escapeMarkdown(member.nickname || member.user.username);
    });

    return Promise.all(this.displayNames);
  }

  async #getFormattedQueue(interaction) {
    const members = await this.#getQueue();
    const membersDisplayNames = await this.#getDisplayNames(
      members,
      interaction.guild,
    );
    const formattedQueue = membersDisplayNames.reduce(
      (acc, displayname) => `${acc} ${displayname} >`,
      '',
    );
    if (formattedQueue) {
      return `${this.rotationName} rotation queue order:${formattedQueue}`;
    }
    return 'No members';
  }

  async #handleAddMembers(members, interaction) {
    let reply = '';
    const memberIds = members.map((member) => member?.id || member);
    const addedIds = await this.#addMembers(memberIds);

    if (addedIds.length !== memberIds.length) {
      const nonAddedIds = memberIds.filter((id) => !addedIds.includes(id));
      const nonAddedNames = await this.#getDisplayNames(
        nonAddedIds,
        interaction.guild,
      );
      const formattedNonAddedNames = nonAddedNames
        .reduce((acc, name) => `${acc} ${name},`, '')
        .slice(0, -1);
      reply += `${formattedNonAddedNames} not added as they are already in the queue\n\n`;
    }

    if (addedIds.length > 0) {
      const addedNotifications = RotationService.#getFormattedPings(addedIds);
      reply += `${addedNotifications} successfully added to the queue\n\n`;
    }

    reply += await this.#getFormattedQueue(interaction);

    interaction.reply(reply.trim());
  }

  async #createQueue(members) {
    await this.redis.del(this.keyName);
    await this.#addMembers(members);
  }

  async #swapMembers(memberIds) {
    const [firstMember, secondMember] = memberIds;
    const queue = await this.#getQueue();

    const firstMemberIndex = queue.indexOf(firstMember);
    const secondMemberIndex = queue.indexOf(secondMember);

    queue[firstMemberIndex] = secondMember;
    queue[secondMemberIndex] = firstMember;

    await this.#createQueue(queue);
  }

  async #handleSwapMembers(members, interaction) {
    const memberIds = members.map((member) => member.id);
    await this.#swapMembers(memberIds);

    const swappedMemberPings = RotationService.#getFormattedPings(memberIds);
    let reply = `${swappedMemberPings} swapped position in the queue\n\n`;
    reply += await this.#getFormattedQueue(interaction);

    interaction.reply(reply.trim());
  }

  async #rotateQueue() {
    const memberToPing = await this.redis.lpop(this.keyName);
    await this.#addMembers([memberToPing]);

    return memberToPing;
  }

  async #handleRotateQueue(interaction) {
    const memberToPing = await this.#rotateQueue(interaction);

    let reply = `<@${memberToPing}> it's your turn for the ${this.rotationName} rotation.\n\n`;
    reply += await this.#getFormattedQueue(interaction);

    interaction.reply(reply.trim());
  }

  async #removeMember(memberId) {
    await this.redis.lrem(this.keyName, 0, memberId);
  }

  async #handleRemoveMember(member, interaction) {
    const memberId = member.id;
    await this.#removeMember(memberId);

    let reply = `<@${memberId}> removed from the queue\n\n`;
    reply += await this.#getFormattedQueue(interaction);

    interaction.reply(reply.trim());
  }

  #getMembers(interactionOptions) {
    this.members = [];
    for (let i = 0; i < 10; i += 1) {
      this.members.push(interactionOptions.getUser(`user${i}`));
    }
    return this.members.filter((member) => member);
  }

  async handleInteraction(interaction) {
    const actionType = interaction.options.getSubcommand();

    const currentQueue = await this.#getQueue();
    const currentQueueLength = currentQueue?.length || 0;

    if (
      currentQueueLength < 2 &&
      actionType !== 'add' &&
      actionType !== 'remove'
    ) {
      await interaction.reply(
        'Less than two members in the queue. Try adding some with `/triage add`!',
      );
      return;
    }

    const members = this.#getMembers(interaction.options);

    switch (actionType) {
      case 'add':
        await this.#handleAddMembers(members, interaction);
        return;
      case 'swap':
        await this.#handleSwapMembers(members, interaction);
        return;
      case 'remove':
        await this.#handleRemoveMember(members[0], interaction);
        return;
      case 'rotate':
        await this.#handleRotateQueue(interaction);
        return;
      default:
    }

    const reply = await this.#getFormattedQueue(interaction);
    await interaction.reply(reply.trim());
  }
}

module.exports = { RotationService };
