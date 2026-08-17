const { escapeMarkdown } = require('discord.js');
const db = require('../../db');
const RedisService = require('../redis');

class RotationService {
  static rotations = [];

  constructor(rotationName, keyName) {
    this.rotationName = rotationName;
    this.keyName = keyName;
    this.redis = RedisService.getInstance();

    RotationService.rotations.push(rotationName);
  }

  async #getQueue() {
    const { rows } = await db.query(
      'SELECT queue FROM rotations WHERE name = $1;',
      [this.rotationName],
    );
    const { queue } = rows[0];
    return queue ?? [];
  }

  async #updateQueue(newQueue) {
    await db.query(
      `
        UPDATE rotations
        SET queue = $1::text[]
        WHERE name = $2;
      `,
      [newQueue, this.rotationName],
    );
  }

  async #idsToMembers(ids, guild) {
    return Promise.all(
      ids.map(async (memberId) => await guild.members.fetch(memberId)),
    );
  }

  async #formatQueue(queue, guild) {
    const queueMembers = await this.#idsToMembers(queue, guild);

    const formattedQueue = queueMembers
      .map((member, i) => {
        const displayName = member.nickname || member.user.username;
        return `${escapeMarkdown(displayName)} ${i === 0 ? '*(current)* >' : '>'}`;
      })
      .join(' ');
    const capitalizedRotationName =
      this.rotationName[0].toUpperCase() + this.rotationName.slice(1);

    return formattedQueue
      ? `${capitalizedRotationName} rotation queue order: ${formattedQueue}`
      : 'No members';
  }

  async #add({ currentQueue, mentionedMembers, interaction }) {
    const addedMembers = [];
    const membersAlreadyInQueue = [];

    for (const member of mentionedMembers) {
      if (currentQueue.includes(member.id)) {
        membersAlreadyInQueue.push(member);
      } else if (!addedMembers.includes(member)) {
        addedMembers.push(member);
      }
    }

    const newQueue = [...currentQueue, ...addedMembers.map(({ id }) => id)];
    await this.#updateQueue(newQueue);

    let reply = '';
    if (membersAlreadyInQueue.length) {
      const mentions = membersAlreadyInQueue.map((member) => member.toString());
      reply += `${mentions.join(' ')} not added as they are already in the queue\n\n`;
    }
    if (addedMembers.length) {
      const mentions = addedMembers.map((member) => member.toString());
      reply += `${mentions.join(' ')} successfully added to the queue\n\n`;
    }

    reply += await this.#formatQueue(newQueue, interaction.guild);

    interaction.reply(reply);
  }

  async #remove({ currentQueue, memberToRemove, interaction }) {
    const newQueue = currentQueue.filter((id) => id !== memberToRemove.id);

    await this.#updateQueue(newQueue);

    const formattedQueue = await this.#formatQueue(newQueue, interaction.guild);
    interaction.reply(
      `${memberToRemove} removed from the queue\n\n${formattedQueue}`,
    );
  }

  async #swap({ currentQueue, mentionedMembers, interaction }) {
    const [firstMember, secondMember] = mentionedMembers;
    const firstMemberIndex = currentQueue.indexOf(firstMember.id);
    const secondMemberIndex = currentQueue.indexOf(secondMember.id);

    const newQueue = [...currentQueue];
    newQueue[firstMemberIndex] = secondMember.id;
    newQueue[secondMemberIndex] = firstMember.id;

    await this.#updateQueue(newQueue);

    const formattedQueue = await this.#formatQueue(newQueue, interaction.guild);
    interaction.reply(
      `${firstMember} swapped with ${secondMember}\n\n${formattedQueue}`,
    );
  }

  async #rotate({ currentQueue, interaction }) {
    const newQueue = [...currentQueue.slice(1), currentQueue[0]];
    await this.#updateQueue(newQueue);

    const formattedQueue = await this.#formatQueue(newQueue, interaction.guild);
    interaction.reply(
      `<@${newQueue[0]}>, it's your turn for the ${this.rotationName} rotation\n\n${formattedQueue}`,
    );
  }

  #getMembers(interactionOptions) {
    const members = [];
    for (let i = 0; i < 10; i += 1) {
      const mentionedMember = interactionOptions.getMember(`user${i}`);
      if (mentionedMember) {
        members.push(mentionedMember);
      }
    }
    return members;
  }

  async handleInteraction(interaction) {
    const subcommand = interaction.options.getSubcommand();

    const currentQueue = await this.#getQueue();
    const subcommandsNeedingMultipleMembers = ['swap', 'rotate'];
    if (
      currentQueue.length < 2 &&
      subcommandsNeedingMultipleMembers.includes(subcommand)
    ) {
      await interaction.reply(
        'Fewer than two members in the queue. Try adding some with `/triage add`!',
      );
      return;
    }

    const mentionedMembers = this.#getMembers(interaction.options);

    switch (subcommand) {
      case 'add':
        await this.#add({ currentQueue, mentionedMembers, interaction });
        return;
      case 'remove':
        await this.#remove({
          currentQueue,
          memberToRemove: mentionedMembers[0],
          interaction,
        });
        return;
      case 'swap':
        await this.#swap({ currentQueue, mentionedMembers, interaction });
        return;
      case 'rotate':
        await this.#rotate({ currentQueue, interaction });
        return;
      // default:
      //   await this.#read(interaction);
      //   return;
    }
  }
}

module.exports = { RotationService };
