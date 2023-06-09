import { SlashCommandBuilder } from "discord.js";
import db from "../../structures/schemas/Time.mjs";
import moment from "moment-timezone";
import { Embed, FailEmbed, SuccessEmbed } from "../../structures/Embed.mjs";

/** @type {import('../../utils/types.mjs').SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("time")
    .setDescription("Everything related to the time system.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set your timezone.")
        .addStringOption((option) =>
          option
            .setName("country")
            .setDescription("The 2 character code of the country you live in.")
            .setMinLength(2)
            .setMaxLength(2)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View a member's time currently.")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("The user to view the time of.")
            .setRequired(true)
        )
    ),
  run: ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "set":
        {
          const country = interaction.options.getString("country");
          if (!moment.tz.countries().includes(country))
            return interaction.reply({
              embeds: [new FailEmbed().setDescription("Invalid country code.")],
              ephemeral: true,
            });

          const timezone = moment.tz.zonesForCountry(country, true)[0];
          db.findOne({ user: interaction.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
              data.timezone = timezone.name;
              data.save();
            } else
              db.create({
                user: interaction.user.id,
                timezone: timezone.name,
              });

            interaction.reply({
              embeds: [
                new SuccessEmbed().setDescription(
                  `Set your timezone to **${timezone.name}**!`
                ),
              ],
              ephemeral: true,
            });
          });
        }
        break;
      case "view":
        {
          const member = interaction.options.getMember("member");

          db.findOne({ user: member.id }, async (err, data) => {
            if (err) throw err;
            if (!data)
              return interaction.reply({
                embeds: [
                  new FailEmbed().setDescription(
                    `${member} has not set their timezone yet.`
                  ),
                ],
                ephemeral: true,
              });

            interaction.reply({
              embeds: [
                new Embed()
                  .setAuthor({
                    name: `Time for ${member.displayName}`,
                    iconURL: member.displayAvatarURL(),
                  })
                  .setDescription(
                    moment
                      .tz(data.timezone)
                      .format("MMMM Do[,] YYYY hh:mm:ss A")
                  )
                  .setFooter({
                    text: `Timezone: ${moment.tz.zone(data.timezone).name}`,
                  }),
              ],
              ephemeral: true,
            });
          });
        }
        break;
    }
  },
};
