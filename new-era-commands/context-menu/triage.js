const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const RedisService = require("../../services/redis");

class TriageService {
  static keyName = "triageMemberList";

  static async addMembers(memberListInput, redisInstance) {
    let memberList = memberListInput;
    if (typeof memberListInput === "string") {
      memberList = memberListInput.split(",");
    }
    await redisInstance.lpush(this.keyName, memberList);
  }

  static async createNewMemberList(memberListInput, redisInstance) {
    await redisInstance.del(this.keyName);
    await this.addMembers(memberListInput, redisInstance);
  }

  static async getMemberList(redisInstance) {
    const members = await redisInstance.lrange(this.keyName, 0, -1);
    return members.reverse();
  }

  static async swapMembers(memberListInput, redisInstance) {
    const [firstMember, secondMember] = memberListInput.split(",");
    const members = await this.getMemberList(redisInstance);

    const firstMemberIndex = members.indexOf(firstMember);
    const secondMemberIndex = members.indexOf(secondMember);
    
    members[firstMemberIndex] = secondMember;
    members[secondMemberIndex] = firstMember;
    console.log(members);
    await this.createNewMemberList(members, redisInstance);
  }

  static async getFormattedMemberList(redisInstance) {
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

  static async handleInteraction(interaction) {
    const redis = RedisService.getInstance();

    const isCreateCall = interaction.options.getString("create");
    const isAddCall = interaction.options.getString("add");
    const isSwapCall = interaction.options.getString("swap");

    if (isCreateCall) {
      await this.createNewMemberList(isCreateCall, redis);
      const memberList = await this.getFormattedMemberList(redis);
      await interaction.reply(`member list set to: ${memberList}`);
    } else if (isAddCall) {
      await this.addMembers(isAddCall, redis);
      const memberList = await this.getFormattedMemberList(redis);
      await interaction.reply(`member list updated to: ${memberList}`);
    } else if (isSwapCall) {
      await this.swapMembers(isSwapCall, redis);
      const memberList = await this.getFormattedMemberList(redis);
      await interaction.reply(`member list updated to: ${memberList}`);
    } else {
      const memberList = await this.getFormattedMemberList(redis);
      await interaction.reply(memberList);
    }
    // console.log(interaction)
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("triage")
    .setDescription("list triage info")
    .addStringOption((option) =>
      option.setName("create").setDescription("create a new triage member list")
    )
    .addStringOption((option) =>
      option
        .setName("add")
        .setDescription("add people to the triage member list")
    )
    .addStringOption((option) =>
      option
        .setName("swap")
        .setDescription("swap the position of two members in the queue")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  execute: async (interaction) => {
    await TriageService.handleInteraction(interaction);
  },
};
