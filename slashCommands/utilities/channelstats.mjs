import { SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { Embed, FailEmbed } from "../../structures/Embed.mjs";
import { abbreviate } from "../../utils/functions.mjs";

/** @type {import('../../utils/types.mjs').SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("channelstats")
    .setDescription("Get a YouTube channel's statistics.")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The YouTube channel URL, handle, or ID.")
        .setRequired(true)
    ),
  run: async ({ interaction }) => {
    const input = interaction.options.getString("input");
    let id = "";
    const isYtUrl = new RegExp(
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com))(\/@|\/channel\/|\/)/gm
    );
    const isHandle = new RegExp(
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com))(\/(@))/gm
    );

    if (input.match(isYtUrl)) {
      try {
        if (input.match(isHandle)) {
          const { data } = await axios.get(
            `https://www.banner.yt/@${input.replace(isHandle, "")}`
          );
          id = data.channelId;
        } else {
          const legacyUrl = new RegExp(
            /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com))(\/|channel\/|\/)/gm
          );
          const { data } = await axios.get(
            `https://www.banner.yt/channel/${input.replace(legacyUrl, "")}`
          );
          id = data.channelId;
        }
      } catch {
        return interaction.reply({
          embeds: [new FailEmbed().setDescription("Invalid YouTube URL.")],
          ephemeral: true,
        });
      }
    } else if (input.match(/@/gm)) {
      try {
        const { data } = await axios.get(`https://www.banner.yt/${input}`);
        id = data.channelId;
      } catch {
        return interaction.reply({
          embeds: [new FailEmbed().setDescription("Invalid YouTube handle.")],
          ephemeral: true,
        });
      }
    } else if (input.match(/UC/gm)) {
      id = input.replace(/[^0-9a-zA-Z_\-]/, "");
    } else {
      const { data } = await axios.get(
        `https://mixerno.space/api/youtube-channel-counter/search/${input}`
      );
      id = data.list[0][2];
    }

    const { data } = await axios.get(`https://www.banner.yt/channel/${id}`);
    const {
      data: { counts },
    } = await axios.get(
      `https://livecounts.xyz/api/youtube-live-subscriber-count/live/${id}`
    );

    let totalViews = data.views;
    let totalLikes = 0;
    if (id === "UCX6OQ3DkcsbYNE6H8uQQuVA") {
      await axios.get("https://mrbeast.livecounts.xyz/count").then((res) => {
        totalViews = abbreviate(res.data.total_views);
        totalLikes = `${abbreviate(res.data.likes)}${
          res.data.likes > 1000 ? ` (${res.data.likes.toLocaleString()})` : ""
        }`;
      });
    } else if (id === "UC-lHJZR3Gqxm24_Vd_AJ5Yw") {
      await axios.get("https://pewdiepie.livecounts.xyz/count").then((res) => {
        totalViews = abbreviate(res.data.total_views);
        totalLikes = `${abbreviate(res.data.likes)}${
          res.data.likes > 1000 ? ` (${res.data.likes.toLocaleString()})` : ""
        }`;
      });
    }

    return interaction.reply({
      embeds: [
        new Embed()
          .setAuthor({
            name: data.name,
            iconURL: `https://www.banner.yt/${id}/avatar`,
          })
          .setDescription(
            `
            **Subscribers**: ${abbreviate(data.subscribers)}${
              data.subscribers > 1000 ? ` (${counts[0].toLocaleString()})` : ""
            }
            **Views**: ${abbreviate(parseInt(totalViews))}${
              totalViews > 1000
                ? ` (${parseInt(totalViews).toLocaleString()})`
                : ""
            }
            **Likes**: ${totalLikes ? totalLikes : "*not available*"}
            **Videos**: ${abbreviate(counts[2])}${
              counts[2] > 1000 ? ` (${counts[2].toLocaleString()})` : ""
            }
            `.trim()
          ),
      ],
    });
  },
};
