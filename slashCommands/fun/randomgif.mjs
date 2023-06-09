import axios from "axios";
import {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

/** @type {import("../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("randomgif")
    .setDescription("Gets a random GIF for you.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The thing you want to search.")
        .setRequired(true)
    ),
  run: async ({ interaction }) => {
    const {
      data: { results },
    } = await axios.get(
      `https://g.tenor.com/v1/random?key=${
        process.env.TENOR_API_KEY
      }&q=${interaction.options.getString(
        "query"
      )}&contentfilter=medium&limit=1`
    );

    const attachment = new AttachmentBuilder(results[0].media[0].mediumgif.url);

    interaction.reply({
      files: [attachment],
    });
  },
};
