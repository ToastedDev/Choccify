import { SlashCommandBuilder } from "discord.js";
import { sendLogMessage } from "../../features/logs.mjs";
import { Embed, FailEmbed, SuccessEmbed } from "../../structures/Embed.mjs";

/** @type {import('../../utils/types.mjs').SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Make the bot say anything you want!")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message you want me to say.")
        .setRequired(false)
    )
    .addAttachmentOption((option) =>
      option
        .setName("attachment")
        .setDescription("An attachment to send along with the message.")
        .setRequired(false)
    ),
  run: async ({ interaction }) => {
    const msg = interaction.options.getString("message");
    const attachment = interaction.options.getAttachment("attachment");
    if (!(msg || attachment))
      return interaction.reply({
        embeds: [
          new FailEmbed().setDescription(
            "You need to specify a message or an attachment."
          ),
        ],
        ephemeral: true,
      });

    let files = [];
    if (attachment) files = [attachment];

    await interaction.channel.send({
      content: msg,
      files,
      allowedMentions: {
        parse: [],
        users: [],
        roles: [],
      },
    });
    interaction.reply({
      embeds: [new SuccessEmbed().setDescription("Message successfully sent!")],
      ephemeral: true,
    });
    sendLogMessage(
      new Embed()
        .setTitle("Sent message through me")
        .setDescription(
          `**Content**: ${msg}\n**Channel**: ${interaction.channel}`
        )
        .setFooter({
          text: interaction.member.displayName,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setTimestamp()
    );
  },
};
