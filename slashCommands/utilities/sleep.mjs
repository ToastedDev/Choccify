import { SlashCommandBuilder } from "discord.js";
import moment from "moment";
import { Embed, FailEmbed, SuccessEmbed } from "../../structures/Embed.mjs";
import db from "../../structures/schemas/Sleep.mjs";

/** @type {import("../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("sleep")
    .setDescription("Everything related to the sleep system.")
    .addSubcommand((subcommand) =>
      subcommand.setName("start").setDescription("Start a sleeping session.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("end").setDescription("End a sleeping session.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List all your sleeping sessions.")
    ),
  run: async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "start":
        {
          db.findOne({ user: interaction.user.id }, async (err, data) => {
            if (err) throw err;
            if (data && data.sleeping)
              return interaction.reply({
                embeds: [
                  new FailEmbed().setDescription(
                    "You currently have an ongoing sleeping session. Please end that one first before starting a new one."
                  ),
                ],
                ephemeral: true,
              });

            if (!data)
              db.create({
                user: interaction.user.id,
                sleeping: true,
                date: Date.now(),
                sessions: [{ start: Date.now() }],
              });
            else {
              data.sleeping = true;
              data.date = Date.now();
              data.sessions.unshift({ start: Date.now() });

              await data.save();
            }

            interaction.reply({
              embeds: [
                new SuccessEmbed().setDescription(
                  "You've now started a sleeping session! Have a good night's rest :)"
                ),
              ],
            });
          });
        }
        break;
      case "end":
        {
          db.findOne({ user: interaction.user.id }, async (err, data) => {
            if (err) throw err;
            if (!data || !data.sleeping)
              return interaction.reply({
                embeds: [
                  new FailEmbed().setDescription(
                    "You do not have an ongoing sleeping session."
                  ),
                ],
                ephemeral: true,
              });

            const date = data.date;

            data.sleeping = false;
            data.date = undefined;
            data.sessions[0].end = Date.now();

            await data.save();

            interaction.reply({
              embeds: [
                new SuccessEmbed().setDescription(
                  `Good morning! You were asleep for **${moment(date).fromNow(
                    true
                  )}**.`
                ),
              ],
            });
          });
        }
        break;
      case "list":
        {
          db.findOne({ user: interaction.user.id }, async (err, data) => {
            if (err) throw err;
            if (!data || !data.sessions.length)
              return interaction.reply({
                embeds: [
                  new FailEmbed().setDescription(
                    "You have not started any sleeping sessions yet."
                  ),
                ],
                ephemeral: true,
              });

            const sessions = data.sessions
              .map((session, index) => {
                if (!session.end) return;
                const start = moment(session.start);
                const end = moment(session.end);
                return `${index + 1}. **${start.from(
                  end,
                  true
                )}** (<t:${parseInt(session.start / 1000)}:T>-<t:${parseInt(
                  session.end / 1000
                )}:T>)`;
              })
              .join("\n");

            interaction.reply({
              embeds: [
                new Embed()
                  .setAuthor({
                    name: interaction.member.displayName,
                    iconURL: interaction.member.displayAvatarURL(),
                  })
                  .setDescription(sessions),
              ],
            });
          });
        }
        break;
    }
  },
};
