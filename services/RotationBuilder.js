const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { RotationService } = require("./rotations/rotation.service");

function rotationBuilder(rotationName, redisKeyName) {
  const data = new SlashCommandBuilder()
    .setName(rotationName)
    .setDescription(`list ${rotationName} info`)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("user to initalize the rotation with")
        .addUserOption((option) =>
          option
            .setName("user0")
            .setDescription("user to initalize the rotation with")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("user1")
            .setDescription("user to initalize the rotation with")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("user2")
            .setDescription("user to initalize the rotation with")
        )
        .addUserOption((option) =>
          option
            .setName("user3")
            .setDescription("user to initalize the rotation with")
        )
        .addUserOption((option) =>
          option
            .setName("user4")
            .setDescription("user to initalize the rotation with")
        )
        .addUserOption((option) =>
          option
            .setName("user5")
            .setDescription("user to initalize the rotation with")
        )
        .addUserOption((option) =>
          option
            .setName("user6")
            .setDescription("user to initalize the rotation with")
        )
        .addUserOption((option) =>
          option
            .setName("user7")
            .setDescription("user to initalize the rotation with")
        )
        .addUserOption((option) =>
          option
            .setName("user8")
            .setDescription("user to initalize the rotation with")
        )
        .addUserOption((option) =>
          option
            .setName("user9")
            .setDescription("user to initalize the rotation with")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription(`add people to the ${rotationName} member list`)
        .addUserOption((option) =>
          option
            .setName("user0")
            .setDescription("user to add to the rotation")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("swap")
        .setDescription("swap the position of two members in the queue")
        .addUserOption((option) =>
          option
            .setName("user0")
            .setDescription("first user to swap")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("user1")
            .setDescription("second user to swap")
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
