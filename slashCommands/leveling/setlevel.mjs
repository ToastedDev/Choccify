import { FailEmbed, SuccessEmbed } from "../../structures/Embed.mjs";
import Levels from "discord.js-leveling";
import { addCommas } from "../../utils/functions.mjs";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

/** @type {import('../../utils/types.mjs').SlashCommand} */
export default {
  userPermissions: ["ManageGuild"],
  data: new SlashCommandBuilder()
    .setName("setlevel")
    .setDescription("Update the level of a member.")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to set the level of.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("new_level")
        .setDescription("The new level.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: async ({ interaction, args }) => {
    const target = interaction.options.getMember("member");

    if (!target)
      return interaction.reply({
        embeds: [new FailEmbed().setDescription("Invalid member.")],
        ephemeral: true,
      });

    const newLevel = interaction.options.getNumber("new_level");

    await Levels.setLevel(target.id, interaction.guild.id, newLevel);
    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `Set ${target}'s level to **${addCommas(newLevel)}**!`
        ),
      ],
      ephemeral: true,
    });
  },
};
