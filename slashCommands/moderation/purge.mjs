import { SuccessEmbed } from "../../structures/Embed.mjs";
import ms from "ms";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

/** @type {import("../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge a number of messages from a channel.")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to delete.")
        .setMaxValue(100)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  run: async ({ interaction }) => {
    const amount = interaction.options.getNumber("amount");

    const messages = await interaction.channel.messages.fetch({
      limit: amount,
    });
    const filtered = messages.filter(
      (msg) => Date.now() - msg.createdTimestamp < ms("14 days") && !msg.pinned
    );

    await interaction.channel.bulkDelete(filtered);
    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(`Deleted ${amount} messages!`),
      ],
      ephemeral: true
    });
  },
};
