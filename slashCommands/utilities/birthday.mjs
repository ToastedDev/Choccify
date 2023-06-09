import { SlashCommandBuilder } from "discord.js";
import { months } from "../../utils/types.mjs";
import db from "../../structures/schemas/Birthday.mjs";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed.mjs";
import { addSuffix } from "../../utils/functions.mjs";
import moment from "moment";

/** @type {import("../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("Everything related to the birthday system.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set your birthday.")
        .addNumberOption((option) =>
          option
            .setName("month")
            .setDescription("The month of your birthday.")
            .addChoices(
              ...months.map((month, index) => {
                return { name: month, value: index };
              })
            )
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("day")
            .setDescription("The day of your birthday.")
            .setMinValue(1)
            .setMaxValue(31)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("check")
        .setDescription("Check if it's someone's birthday.")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("The member to check the birthday of.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("remove").setDescription("Remove your birthday.")
    ),
  run: async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "set":
        {
          const month = interaction.options.getNumber("month");
          const day = interaction.options.getNumber("day");
          const now = new Date();

          if (!moment([now.getFullYear() + 1, month, day]).isValid())
            return interaction.reply({
              embeds: [
                new FailEmbed().setDescription(
                  "The date specified is invalid."
                ),
              ],
              ephemeral: true,
            });

          db.findOne({ user: interaction.user.id }, async (err, data) => {
            if (err) throw err;
            if (!data)
              await db.create({
                user: interaction.user.id,
                month,
                day,
              });
            else {
              data.month = month;
              data.day = day;
            }

            interaction.reply({
              embeds: [
                new SuccessEmbed().setDescription(
                  `Successfully set your birthday to **${
                    months[month]
                  } ${addSuffix(day)}**!`
                ),
              ],
              ephemeral: true,
            });
          });
        }
        break;
      case "check":
        {
          const member = interaction.options.getMember("member");

          db.findOne({ user: member.id }, async (err, data) => {
            if (err) throw err;
            if (!data)
              return interaction.reply({
                embeds: [
                  new FailEmbed().setDescription(
                    `${member} hasn't set their birthday yet.`
                  ),
                ],
                ephemeral: true,
              });

            const now = new Date();
            if (now.getMonth() !== data.month || now.getDate() !== data.day)
              interaction.reply({
                embeds: [
                  new FailEmbed().setDescription(
                    `It's not ${member}'s birthday yet. But it will be <t:${
                      new Date(
                        `${data.month + 1}  ${data.day}, ${
                          now.getFullYear() + 1
                        }`
                      ).getTime() / 1000
                    }:R>!`
                  ),
                ],
                ephemeral: true,
              });
            else
              interaction.reply({
                embeds: [
                  new SuccessEmbed().setDescription(
                    `It's ${member}'s birthday today! Tell them "happy birthday"!`
                  ),
                ],
                ephemeral: true,
              });
          });
        }
        break;
      case "remove":
        {
          const data = db.findOne({ user: interaction.user.id });
          if (!data)
            return interaction.reply({
              embeds: [
                new FailEmbed().setDescription(
                  "You haven't set your birthday yet."
                ),
              ],
              ephemeral: true,
            });
          await db.deleteOne({ user: interaction.user.id });
          interaction.reply({
            embeds: [
              new SuccessEmbed().setDescription(
                "Successfully removed your birthday!"
              ),
            ],
            ephemeral: true,
          });
        }
        break;
    }
  },
};
