const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { RotationService } = require("./rotations/rotation.service");

function rotationBuilder(rotationName, redisKeyName) {
  const data = new SlashCommandBuilder()
    .setName(rotationName)
    .setDescription(`list ${rotationName} info`)
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
        .setDescription(`add people to the ${rotationName} member list`)
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
    .addSubcommand((subcommand) =>
      subcommand.setName("rotate").setDescription(`rotate the queue`)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

  async function execute(interaction) {
    const triageService = new RotationService(redisKeyName);
    await triageService.handleInteraction(interaction);
  }

  return { data, execute };
}
module.exports = { rotationBuilder };
