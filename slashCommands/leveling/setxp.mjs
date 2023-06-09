import { FailEmbed, SuccessEmbed } from "../../structures/Embed.mjs";
import Levels from "discord.js-leveling";
import { addCommas } from "../../utils/functions.mjs";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

/** @type {import('../../utils/types.mjs').SlashCommand} */
export default {
  usage: "<member> <new xp>",
  userPermissions: ["ManageGuild"],
  data: new SlashCommandBuilder()
    .setName("setxp")
    .setDescription("Update the XP of a member.")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to set the level of.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("new_xp").setDescription("The new XP.").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: async ({ interaction, args }) => {
    const target = interaction.options.getMember("member");

    if (!target)
      return message.reply({
        embeds: [new FailEmbed().setDescription("Invalid member.")],
        ephemeral: true,
      });

    const newXp = interaction.options.getNumber("new_xp");

    await Levels.setXp(target.id, interaction.guild.id, newXp);
    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `Set ${target}'s XP to **${addCommas(newXp)}**!`
        ),
      ],
      ephemeral: true,
    });
  },
};
