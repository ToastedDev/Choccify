import canvacord from "canvacord";
import Levels from "discord.js-leveling";
import { FailEmbed } from "../../structures/Embed.mjs";
import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";

/** @type {import("../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("View someone's level.")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to view the level of.")
        .setRequired(false)
    ),
  run: async ({ interaction, args }) => {
    const target =
      interaction.options.getMember("member") || interaction.member;

    const user = await Levels.fetch(target.id, interaction.guild.id, true);
    if (!user)
      return interaction.reply({
        embeds: [
          new FailEmbed().setDescription(
            "The member specified has not gained enough XP."
          ),
        ],
      });

    const neededXp = Levels.xpFor(parseInt(user.level) + 1);

    const card = new canvacord.Rank()
      .setUsername(target.user.username)
      .setDiscriminator(target.user.discriminator)
      .setAvatar(target.user.displayAvatarURL({ forceStatic: true }))
      .setCurrentXP(user.xp)
      .setRequiredXP(neededXp)
      .setLevel(user.level)
      .setRank(user.position)
      .setStatus(target.presence?.status || "offline")
      .setProgressBar("#FFFFFF", "COLOR");

    card.build().then((data) => {
      const attachment = new AttachmentBuilder(data, "rankcard.png");
      interaction.reply({ files: [attachment] });
    });
  },
};
