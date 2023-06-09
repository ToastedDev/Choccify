import { ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";

/** @type {import("../../utils/types.mjs").ContextMenu} */
export default {
  data: new ContextMenuCommandBuilder()
    .setName("Get message ID")
    .setType(ApplicationCommandType.Message),
  run: async ({ interaction }) => {
    interaction.reply({
      content: `Message ID: ${interaction.targetId}`,
      ephemeral: true,
    });
  },
};
