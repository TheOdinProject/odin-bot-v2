const {
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');
const prettierFormatter = require('./prettier-formatter');

class FormatCodeService {
  static modalId = 'format-code-modal';

  // used to store the codeblock for handleModalSubmit method
  static #codeBlock;

  static async handleSlashCommandInteraction(interaction) {
    const infoMessageEmbed = FormatCodeService.#infoMessageEmbedBuilder();

    await FormatCodeService.sendMessage(interaction, {
      embeds: [infoMessageEmbed],
    });
  }

  static async handleContextMenuInteraction(interaction) {
    const { targetMessage } = interaction;
    const firstCodeBlock = FormatCodeService.findCodeBlocks(
      targetMessage.content,
    )[0];

    if (!firstCodeBlock) {
      await FormatCodeService.sendMessage(interaction, {
        content: 'No codeblocks found.',
        ephemeral: true,
      });
      return;
    }

    if (!firstCodeBlock.lang) {
      FormatCodeService.#codeBlock = firstCodeBlock;
      const modal = FormatCodeService.#modalBuilder();
      await interaction.showModal(modal);
      return;
    }

    await FormatCodeService.sendFormattedCodeBlock(interaction, firstCodeBlock);
  }

  static async handleModalSubmit(interaction) {
    const lang = interaction.fields.getTextInputValue(
      FormatCodeService.modalId,
    );
    FormatCodeService.#codeBlock.lang = lang;

    await FormatCodeService.sendFormattedCodeBlock(
      interaction,
      FormatCodeService.#codeBlock,
    );
  }

  static async sendFormattedCodeBlock(interaction, codeBlock) {
    let formattedCodeBlock;
    try {
      formattedCodeBlock = {
        lang: codeBlock.lang,
        content: await FormatCodeService.formatCodeBlockContent(codeBlock),
      };
    } catch (error) {
      await FormatCodeService.sendMessage(interaction, {
        content: error.message,
        ephemeral: true,
      });
      return;
    }

    const formatCodeMessageEmbed =
      FormatCodeService.#formattedCodeMessageEmbedBuilder(formattedCodeBlock);

    await FormatCodeService.sendMessage(interaction, {
      embeds: [formatCodeMessageEmbed],
    });
  }

  static findCodeBlocks(messageContent) {
    const PATTERN = /^```([A-Za-z]*)?\n([\s\S]*?)```*$/gm;

    let matches;
    const codeBlocks = [];

    /* eslint-disable no-cond-assign */
    while ((matches = PATTERN.exec(messageContent)) !== null) {
      const [, lang, content] = matches;
      codeBlocks.push({ lang, content });
    }

    return codeBlocks;
  }

  static async formatCodeBlockContent(codeBlock) {
    try {
      const formatted = await prettierFormatter(codeBlock);
      return formatted;
    } catch (error) {
      if (error instanceof SyntaxError) {
        return error.message;
      }
      throw new Error(error.message);
    }
  }

  static async sendMessage(interaction, message) {
    await interaction.reply(message);
  }

  static #modalBuilder() {
    const modal = new ModalBuilder()
      .setCustomId(FormatCodeService.modalId)
      .setTitle('No Lang Specified');
    const langInput = new TextInputBuilder()
      .setCustomId(FormatCodeService.modalId)
      .setLabel('Specify lang (html, css, js, json, md)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);
    const actionRow = new ActionRowBuilder().addComponents(langInput);
    modal.addComponents(actionRow);
    return modal;
  }

  static #formattedCodeMessageEmbedBuilder(formattedCodeBlock) {
    return new EmbedBuilder().setColor('#cc9543').setTitle('Formatted Code')
      .setDescription(`
        ${`\`\`\`${formattedCodeBlock.lang}\n${formattedCodeBlock.content}\n\`\`\``}
      `);
  }

  static #infoMessageEmbedBuilder() {
    return new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Format Code (beta)')
      .setDescription(
        'Use [prettier](https://prettier.io/) to format code block in a message.',
      )
      .addFields([
        {
          name: 'Instructions',
          value:
            "- Write click on a message. Go to Apps > beta Format Code option. \n- The bot will reply with a formatted code block. \n- If the codeblock doesn't have the lang specified a modal will pop up prompting for a lang input. \n- If the bot fails to format the code block, it will reply with an error message.",
          inline: true,
        },
        {
          name: 'Limitations',
          value:
            '1. Limited parsers. Full list here: https://prettier.io/docs/en/options.html#parser\n\n2. Only formats the first code block in a message.',
          inline: true,
        },
      ]);
  }
}

module.exports = FormatCodeService;
