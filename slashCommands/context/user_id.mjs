import { ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";

/** @type {import("../../utils/types.mjs").ContextMenu} */
export default {
  data: new ContextMenuCommandBuilder()
    .setName("Get user ID")
    .setType(ApplicationCommandType.User),
  run: async ({ interaction }) => {
    interaction.reply({
      content: `User ID: ${interaction.targetId}`,
      ephemeral: true,
    });
  },
};
