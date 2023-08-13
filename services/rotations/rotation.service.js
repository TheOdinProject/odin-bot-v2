const RedisService = require("../redis");

class RotationService {
  constructor(keyName) {
    this.keyName = keyName;
  }

  async addMembers(memberList, redisInstance) {
    const userIds = memberList.map((member) => member?.id || member);
    await redisInstance.lpush(this.keyName, userIds);
  }

  async createNewMemberList(memberList, redisInstance) {
    await redisInstance.del(this.keyName);
    await this.addMembers(memberList, redisInstance);
  }

  async getMemberList(redisInstance) {
    const members = await redisInstance.lrange(this.keyName, 0, -1);
    return members.reverse();
  }

  async swapMembers(users, redisInstance) {
    const [firstMember, secondMember] = users.map((user) => user.id);
    const currentList = await this.getMemberList(redisInstance);

    const firstMemberIndex = currentList.indexOf(firstMember);
    const secondMemberIndex = currentList.indexOf(secondMember);

    currentList[firstMemberIndex] = secondMember;
    currentList[secondMemberIndex] = firstMember;

    await this.createNewMemberList(currentList, redisInstance);
  }

  async getDisplayNames(members, server) {
    this.displayNames = members.map(async (memberId) => {
      const member = await server.members.fetch(memberId);
      if (member.nickname) {
        return member.nickname;
      }
      return member.user.username;
    });

    return Promise.all(this.displayNames);
  }

  async getFormattedMemberList(server, redisInstance) {
    const members = await this.getMemberList(redisInstance);
    const membersDisplayNames = await this.getDisplayNames(members, server);
    const formattedMemberList = membersDisplayNames.reduce(
      (acc, displayname) => `${acc} ${displayname}`,
      ""
    );
    if (formattedMemberList) {
      return formattedMemberList;
    }
    return "No members";
  }

  async rotateMemberList(interaction, redisInstance) {
    const members = await this.getMemberList(redisInstance);
    const memberToPing = members[0];
    members.push(members.shift());
    await this.createNewMemberList(members, redisInstance);
    const formattedMembers = await this.getFormattedMemberList(
      interaction.guild,
      redisInstance
    );
    const reply = `<@${memberToPing}> it's your turn for the rotation.\nThe rotation order is now ${formattedMembers}.`;
    interaction.reply(reply);
  }

  async removeMembers(members, redisInstance) {
    const memberId = members[0].id
    await redisInstance.lrem(this.keyName, 0, memberId);
  }

  getUsers(interactionOptions) {
    this.users = [];
    for (let i = 0; i < 10; i += 1) {
      this.users.push(interactionOptions.getUser(`user${i}`));
    }
    return this.users.filter((user) => !!user);
  }

  async handleInteraction(interaction) {
    const redis = RedisService.getInstance();

    const actionType = interaction.options.getSubcommand();

    const users = this.getUsers(interaction.options);

    let replyModifier;

    switch (actionType) {
      case "create":
        await this.createNewMemberList(users, redis);
        replyModifier = "initalized as";
        break;
      case "add":
        await this.addMembers(users, redis);
        replyModifier = "updated to";
        break;
      case "swap":
        await this.swapMembers(users, redis);
        replyModifier = "updated to";
        break;
      case "remove":
        await this.removeMembers(users, redis);
        replyModifier = "updated to";
        break;
      case "rotate":
        await this.rotateMemberList(interaction, redis);
        return;
      default:
        replyModifier = "is";
    }

    const memberList = await this.getFormattedMemberList(
      interaction.guild,
      redis
    );
    await interaction.reply(`member list ${replyModifier}: ${memberList}`);
  }
}

module.exports = { RotationService };
