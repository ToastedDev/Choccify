import {
  ActionRowBuilder,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { sendLogMessage } from "../../features/logs.mjs";
import { Embed, SuccessEmbed } from "../../structures/Embed.mjs";

/** @type {import("../../utils/types.mjs").ContextMenu} */
export default {
  data: new ContextMenuCommandBuilder()
    .setName("Reply to this message")
    .setType(ApplicationCommandType.Message),
  run: async ({ interaction }) => {
    if (!interaction.isMessageContextMenuCommand()) return;

    const modal = new ModalBuilder()
      .setCustomId("message")
      .setTitle(
        `Reply to ${interaction.targetMessage.member.nickname}'s message`
      );

    const inputs = [
      new TextInputBuilder()
        .setCustomId("message")
        .setLabel("What message do you want me to say?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true),
    ];

    modal.addComponents(
      inputs.map((input) => new ActionRowBuilder().addComponents(input))
    );

    await interaction.showModal(modal);

    await interaction
      .awaitModalSubmit({
        time: 30_000,
      })
      .then(async (modal) => {
        await modal.deferReply({
          ephemeral: true,
        });

        const content = modal.fields.getTextInputValue("message");
        modal.followUp({
          embeds: [
            new SuccessEmbed().setDescription("Message successfully sent!"),
          ],
          ephemeral: true,
        });
        interaction.targetMessage.reply({
          content,
          allowedMentions: {
            parse: [],
            users: [],
            roles: [],
            repliedUser: true,
          },
        });
        sendLogMessage(
          new Embed()
            .setTitle("Sent message through me")
            .setDescription(
              `**Content**: ${content}\n**Replied to**: ${interaction.targetMessage.member.nickname} ([jump](${interaction.targetMessage.url}))\n**Channel**: ${interaction.channel}`
            )
            .setFooter({
              text: interaction.member.displayName,
              iconURL: interaction.member.displayAvatarURL(),
            })
            .setTimestamp()
        );
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
