const RedisService = require("../redis");

class RotationService {
  constructor(keyName, rotationName) {
    this.keyName = keyName;
    this.rotationName = rotationName;
    this.redis = RedisService.getInstance();
  }

  async #addMembers(memberList) {
    const memberIds = memberList.map((member) => member?.id || member);
    await this.redis.rpush(this.keyName, memberIds);
  }

  async #createNewMemberList(memberList) {
    await this.redis.del(this.keyName);
    await this.#addMembers(memberList);
  }

  async #getMemberList() {
    const members = await this.redis.lrange(this.keyName, 0, -1);
    return members;
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

  async #rotateMemberList(interaction) {
    const memberToPing = await this.redis.lpop(this.keyName)
    await this.#addMembers([memberToPing])

    const formattedMembers = await this.#getFormattedMemberList(
      interaction.guild
    );
    const reply = `<@${memberToPing}> it's your turn for the ${this.rotationName} rotation.\nThe ${this.rotationName} rotation order is now ${formattedMembers}.`;
    interaction.reply(reply);
  }

  async #removeMembers(members) {
    const memberId = members[0].id;
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
      case "create":
        await this.#createNewMemberList(members);
        replyModifier = "initalized as";
        break;
      case "add":
        await this.#addMembers(members);
        break;
      case "swap":
        await this.#swapMembers(members);
        break;
      case "remove":
        await this.#removeMembers(members);
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
