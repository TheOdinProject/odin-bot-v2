const RedisService = require("../redis");

class RotationService {
  constructor(keyName, rotationName) {
    this.keyName = keyName;
    this.rotationName = rotationName;
    this.redis = RedisService.getInstance();
  }

  async #getMemberList() {
    const members = await this.redis.lrange(this.keyName, 0, -1);
    return members;
  }

  async #addMembers(memberIds) {
    const currentList = await this.#getMemberList();

    const newMemberIds = memberIds.filter((id) => !currentList?.includes(id));

    if (newMemberIds.length > 0) {
      await this.redis.rpush(this.keyName, newMemberIds);
    }

    return newMemberIds;
  }

  static #getFormattedPings(memberIds) {
    return memberIds.reduce((acc, id) => `${acc} <@${id}>`, "");
  }

  async #getDisplayNames(members, server) {
    this.displayNames = members.map(async (memberId) => {
      const member = await server.members.fetch(memberId);
      if (member.nickname) {
        return member.nickname;
      }
      return member.user.username;
    });

    return Promise.all(this.displayNames);
  }

  async #getFormattedMemberList(server) {
    const members = await this.#getMemberList();
    const membersDisplayNames = await this.#getDisplayNames(members, server);
    const formattedMemberList = membersDisplayNames.reduce(
      (acc, displayname) => `${acc} ${displayname} >`,
      ""
    );
    if (formattedMemberList) {
      return formattedMemberList;
    }
    return "No members";
  }

  async #handleAddMembers(memberList, interaction) {
    let reply = "";
    const memberIds = memberList.map((member) => member?.id || member);
    const addedIds = await this.#addMembers(memberIds);

    if (addedIds.length !== memberIds.length) {
      const nonAddedIds = memberIds.filter((id) => !addedIds.includes(id));
      const nonAddedNames = await this.#getDisplayNames(
        nonAddedIds,
        interaction.guild
      );
      const formattedNonAddedNames = nonAddedNames
        .reduce((acc, name) => `${acc} ${name},`, "")
        .slice(0, -1);
      reply += `${formattedNonAddedNames} not added as they are already in the queue\n\n`;
    }

    if (addedIds.length > 0) {
      const addedNotifications = RotationService.#getFormattedPings(addedIds);
      reply += `${addedNotifications} successfully added to the queue\n\n`;
    }

    const newList = await this.#getFormattedMemberList(interaction.guild);
    reply += `${this.rotationName} rotation queue order:${newList}`;

    interaction.reply(reply.trim());
  }

  async #createNewMemberList(memberList) {
    await this.redis.del(this.keyName);
    await this.#addMembers(memberList);
  }

  async #swapMembers(members) {
    const [firstMember, secondMember] = members.map((member) => member.id);
    const currentList = await this.#getMemberList();

    const firstMemberIndex = currentList.indexOf(firstMember);
    const secondMemberIndex = currentList.indexOf(secondMember);

    currentList[firstMemberIndex] = secondMember;
    currentList[secondMemberIndex] = firstMember;

    await this.#createNewMemberList(currentList);
  }

  async #rotateMemberList(interaction) {
    const memberToPing = await this.redis.lpop(this.keyName);
    await this.#addMembers([memberToPing]);

    const formattedMembers = await this.#getFormattedMemberList(
      interaction.guild
    );
    const reply = `<@${memberToPing}> it's your turn for the ${this.rotationName} rotation.\nThe ${this.rotationName} rotation order is now ${formattedMembers}.`;
    interaction.reply(reply);
  }

  async #removeMember(member) {
    const memberId = member.id;
    await this.redis.lrem(this.keyName, 0, memberId);
  }

  #getMembers(interactionOptions) {
    this.members = [];
    for (let i = 0; i < 10; i += 1) {
      this.members.push(interactionOptions.getUser(`user${i}`));
    }
    return this.members.filter((member) => !!member);
  }

  async handleInteraction(interaction) {
    const actionType = interaction.options.getSubcommand();

    const members = this.#getMembers(interaction.options);

    let replyModifier = "updated to";

    switch (actionType) {
      case "add":
        await this.#handleAddMembers(members, interaction);
        return;
      case "swap":
        await this.#swapMembers(members);
        break;
      case "remove":
        await this.#removeMember(members[0]);
        break;
      case "rotate":
        await this.#rotateMemberList(interaction);
        return;
      default:
        replyModifier = "is";
    }

    const memberList = await this.#getFormattedMemberList(interaction.guild);
    await interaction.reply(
      `${this.rotationName} rotation queue order ${replyModifier}:${memberList}`
    );
  }
}

module.exports = { RotationService };
