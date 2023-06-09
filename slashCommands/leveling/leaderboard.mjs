import { SlashCommandBuilder } from "discord.js";
import Levels from "discord.js-leveling";
import { Embed, FailEmbed } from "../../structures/Embed.mjs";
import { addCommas } from "../../utils/functions.mjs";

/** @type {import('../../utils/types.mjs').SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the top 10 members."),
  run: async ({ client, interaction }) => {
    const rawLeaderboard = await Levels.fetchLeaderboard(
      interaction.guild.id,
      10
    );
    if (rawLeaderboard.length < 1)
      return interaction.reply({
        embeds: [
          new FailEmbed().setDescription(
            "Nobody has entered the leaderboard yet."
          ),
        ],
        ephemeral: true,
      });

    const leaderboard = await Levels.computeLeaderboard(
      client,
      rawLeaderboard,
      true
    );
    interaction.reply({
      embeds: [
        new Embed()
          .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL(),
          })
          .setDescription(
            leaderboard
              .map(
                (m) =>
                  `**${m.position}.** <@${m.userID}>: **level ${addCommas(
                    m.level
                  )}** (${addCommas(m.xp)} xp)`
              )
              .join("\n")
          ),
      ],
    });
  },
};
