const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { RotationService } = require("../services/rotations/rotation.service");
const { addSubcommands } = require("./slash-command-helpers");

function rotationBuilder(rotationName, redisKeyName) {
  const subcommands = [
    { name: "read", description: "report the current queue order" },
    { name: "rotate", description: "rotate the queue" },
    {
      name: "add",
      description: `add people to the ${rotationName} rotation queue`,
      min: 1,
      max: 10,
    },
    {
      name: "swap",
      description: "swap the position of two members in the queue",
      min: 2,
      max: 2,
    },
    {
      name: "remove",
      description: "remove members from the queue",
      min: 1,
      max: 1,
    },
  ];

  const base = new SlashCommandBuilder()
    .setName(rotationName)
    .setDescription(`list ${rotationName} info`)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

  const data = addSubcommands(base, subcommands);

  async function execute(interaction) {
    const triageService = new RotationService(redisKeyName, rotationName);
    await triageService.handleInteraction(interaction);
  }

  return { data, execute };
}

module.exports = { rotationBuilder };
