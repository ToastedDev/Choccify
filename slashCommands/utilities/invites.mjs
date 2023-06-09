import { SlashCommandBuilder } from "discord.js";
import { Embed } from "../../structures/Embed.mjs";
import { addCommas } from "../../utils/functions.mjs";

/** @type {import("../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("invites")
    .setDescription("View how many invites a member has.")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to view the invites of.")
        .setRequired(false)
    ),
  run: async ({ interaction }) => {
    const member =
      interaction.options.getMember("member") || interaction.member;
    const invites = (await interaction.guild.invites.fetch())
      .filter((inv) => inv.inviter && inv.inviter.id === member.id)
      .map((inv) => inv.uses)
      .reduce((a, b) => a + b, 0);

    interaction.reply({
      embeds: [
        new Embed().setDescription(
          `**${member.displayName}** has **${addCommas(invites)}** invites.`
        ),
      ],
      ephemeral: true,
    });
  },
};
