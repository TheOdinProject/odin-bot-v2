const RedisService = require("../redis");

class RotationService {
  constructor(keyName) {
    this.keyName = keyName;
  }

  async addMembers(memberList, redisInstance) {
    const userIds = memberList.map((member) => member.id);
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

  async swapMembers(firstMember, secondMember, redisInstance) {
    const members = await this.getMemberList(redisInstance);

    const firstMemberIndex = members.indexOf(firstMember);
    const secondMemberIndex = members.indexOf(secondMember);

    members[firstMemberIndex] = secondMember;
    members[secondMemberIndex] = firstMember;

    await this.createNewMemberList(members, redisInstance);
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

  async handleInteraction(interaction) {
    const redis = RedisService.getInstance();

    const actionType = interaction.options.getSubcommand();
    const names = interaction.options.getString("names");

    const firstMember = interaction.options.getUser("user1");
    const secondMember = interaction.options.getUser("user2");
    const thirdMember = interaction.options.getUser("user3");
    const users = [firstMember, secondMember, thirdMember];

    let replyModifier;

    switch (actionType) {
      case "create":
        await this.createNewMemberList(users, redis);
        replyModifier = "initalized as";
        break;
      case "add":
        await this.addMembers(names, redis);
        replyModifier = "updated to";
        break;
      case "swap":
        await this.swapMembers(firstMember, secondMember, redis);
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
