const RedisService = require("../redis");

class RotationService {
  constructor(keyName) {
    this.keyName = keyName;
  }

  async addMembers(memberListInput, redisInstance) {
    let memberList = memberListInput;
    if (typeof memberListInput === "string") {
      memberList = memberListInput.split(",");
    }
    await redisInstance.lpush(this.keyName, memberList);
  }

  async createNewMemberList(memberListInput, redisInstance) {
    await redisInstance.del(this.keyName);
    await this.addMembers(memberListInput, redisInstance);
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

  async getFormattedMemberList(redisInstance) {
    const members = await this.getMemberList(redisInstance);
    const formattedMemberList = members.reduce(
      (acc, member) => `${acc} ${member}`,
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
    const formattedMembers = await this.getFormattedMemberList(redisInstance);
    const reply = `<@${memberToPing}> it's your turn for the rotation.\nThe rotation order is now ${formattedMembers}.`;
    interaction.reply(reply);
  }

  async handleInteraction(interaction) {
    const redis = RedisService.getInstance();

    const actionType = interaction.options.getSubcommand();
    const names = interaction.options.getString("names");

    const firstMember = interaction.options.getString("first");
    const secondMember = interaction.options.getString("second");

    let replyModifier;

    switch (actionType) {
      case "create":
        await this.createNewMemberList(names, redis);
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

    const memberList = await this.getFormattedMemberList(redis);
    await interaction.reply(`member list ${replyModifier}: ${memberList}`);
  }
}

module.exports = { RotationService };
