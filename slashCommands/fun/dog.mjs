import animals from "animals.js";
import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";

/** @type {import("../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("dog")
    .setDescription("Get a random picture of a dog."),
  run: async ({ interaction }) => {
    interaction.reply({
      files: [new AttachmentBuilder(await animals.dog(), { name: "dog.png" })],
    });
  },
};
