import { randomNum } from "../../utils/functions.mjs";
import request from "request";
import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";

const types = ["milk", "milkshake", "chip cookie", "biscuit"];

/** @type {import("../../utils/types.mjs").SlashCommand} */
export default {
  name: "chocolate",
  description: "Get some random chocolate pictures!",
  usage: "[type of chocolate image]",
  botChannelOnly: false,
  data: new SlashCommandBuilder()
    .setName("chocolate")
    .setDescription("Get some random chocolate pictures!")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription('The type of chocolate image you want. (e.g. "milk")')
        .setRequired(false)
    ),
  run: async ({ interaction }) => {
    let type =
      interaction.options.getString("type") ||
      types[randomNum(0, types.length)];

    request(
      {
        url: `https://source.unsplash.com/random/?chocolate%20${type}`,
        method: "GET",
      },
      (_error, res) => {
        const attachment = new AttachmentBuilder(res.request.href, {
          name: `chocolate-${type.replace(" ", "-")}.png`,
        });
        interaction.reply({
          content: `Here's some chocolate ${type.toLowerCase()}.`,
          files: [attachment],
        });
      }
    );
  },
};
