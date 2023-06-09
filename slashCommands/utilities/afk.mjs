import { SlashCommandBuilder } from "discord.js";
import moment from "moment";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed.mjs";
import db from "../../structures/schemas/AFK.mjs";

/** @type {import("../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Everything related to the AFK system.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set yourself as AFK.")
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason why you're AFK.")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("remove").setDescription("Return from being AFK.")
    ),
  run: async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();
    const userInDb = await db.exists({
      user: interaction.user.id,
      guild: interaction.guild.id,
    });

    switch (subcommand) {
      case "set":
        {
          if (userInDb)
            return interaction.reply({
              embeds: [new FailEmbed().setDescription("You're already AFK.")],
              ephemeral: true,
            });
          const reason =
            interaction.options.getString("reason") || "No reason specified.";

          await db.create({
            user: interaction.user.id,
            guild: interaction.guild.id,
            reason,
          });

          interaction.reply({
            embeds: [
              new SuccessEmbed().setDescription(
                `You are now AFK!\n> **Reason**: ${reason}`
              ),
            ],
          });
        }
        break;
      case "remove":
        {
          if (!userInDb)
            return interaction.reply({
              embeds: [new FailEmbed().setDescription("You're not AFK.")],
              ephemeral: true,
            });

          const data = await db.findOneAndDelete({
            user: interaction.user.id,
            guild: interaction.guild.id,
          });

          interaction.reply({
            embeds: [
              new SuccessEmbed().setDescription(
                `Welcome back! You were AFK for **${moment(data.date).fromNow(
                  true
                )}**.`
              ),
            ],
          });
        }
        break;
    }
  },
};
