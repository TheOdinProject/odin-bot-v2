function addUserOptions(builder, min, max, description) {
  for (let i = 0; i < min; i += 1) {
    builder.addUserOption((option) =>
      option.setName(`user${i}`).setDescription(description).setRequired(true)
    );
  }

  for (let i = min; i < max; i += 1) {
    builder.addUserOption((option) =>
      option.setName(`user${i}`).setDescription(description)
    );
  }

  return builder;
}

function addSubcommands(builder, subcommandObjects) {
  subcommandObjects.forEach((object) => {
    const { name, description, min, max } = object;
    builder.addSubcommand((subcommand) => {
      subcommand.setName(name).setDescription(description);
      if (min) {
        return addUserOptions(subcommand, min, max, description);
      }
      return subcommand;
    });
  });

  return builder;
}

module.exports = { addSubcommands };
