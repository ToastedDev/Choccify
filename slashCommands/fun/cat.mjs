import animals from "animals.js";
import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";

/** @type {import("../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("Get a random picture of a cat."),
  run: async ({ interaction }) => {
    interaction.reply({
      files: [new AttachmentBuilder(await animals.cat(), { name: "cat.png" })],
    });
  },
};
