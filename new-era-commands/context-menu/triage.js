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

  static async swapMembers(firstMember, secondMember, redisInstance) {
    const members = await this.getMemberList(redisInstance);

    const firstMemberIndex = members.indexOf(firstMember);
    const secondMemberIndex = members.indexOf(secondMember);

    members[firstMemberIndex] = secondMember;
    members[secondMemberIndex] = firstMember;

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

    const actionType = interaction.options.getSubcommand();
    const names = interaction.options.getString("names");

    const firstMember = interaction.options.getString("first");
    const secondMember = interaction.options.getString("second");

    let replyModifier;

    switch (actionType) {
      case "create":
        await this.createNewMemberList(names, redis);
        replyModifier = 'initalized as'
        break;
      case "add":
        await this.addMembers(names, redis);
        replyModifier = 'updated to'
        break;
      case "swap":
        await this.swapMembers(firstMember, secondMember, redis);
        replyModifier = 'updated to'
        break;
      default:
        replyModifier = 'is'
    }

    const memberList = await this.getFormattedMemberList(redis);
    await interaction.reply(`member list ${replyModifier}: ${memberList}`);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("triage")
    .setDescription("list triage info")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("names to initialize the list with")
        .addStringOption((option) =>
          option
            .setName("names")
            .setDescription("names to initialize the list with")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("add people to the triage member list")
        .addStringOption((option) =>
          option
            .setName("names")
            .setDescription("names to add to the list")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("swap")
        .setDescription("swap the position of two members in the queue")
        .addStringOption((option) =>
          option
            .setName("first")
            .setDescription("names to add to the list")
            .setRequired(true)
        )
        .addStringOption((secondOption) =>
          secondOption
            .setName("second")
            .setDescription("names to add to the list")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("read").setDescription("report the current value")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  execute: async (interaction) => {
    await TriageService.handleInteraction(interaction);
  },
};
