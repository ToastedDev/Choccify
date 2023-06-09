import { ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";
import { Embed } from "../../structures/Embed.mjs";

/** @type {import("../../utils/types.mjs").ContextMenu} */
export default {
  data: new ContextMenuCommandBuilder()
    .setName("Get server avatar")
    .setType(ApplicationCommandType.User),
  run: async ({ interaction }) => {
    const { targetMember: member } = interaction;
    interaction.reply({
      embeds: [
        new Embed()
          .setTitle(`${member.displayName}'s server avatar`)
          .setDescription(
            `[Click to download](${member.displayAvatarURL({
              size: 4096,
              extension: "png",
            })})`
          )
          .setImage(member.displayAvatarURL({ size: 4096 })),
      ],
      ephemeral: true,
    });
  },
};
