import db from "../structures/schemas/AFK.mjs";
import moment from "moment";
import { Embed, SuccessEmbed } from "../structures/Embed.mjs";
import { prefix } from "../config.mjs";

/** @type {import("../utils/types.mjs").Feature} */
export default (client) => {
  client.on("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return;

    const mentioned = message.mentions.members.first();
    if (
      mentioned &&
      (await db.exists({ user: mentioned.id, guild: message.guild.id }))
    ) {
      const data = await db.findOne({
        user: mentioned.id,
        guild: message.guild.id,
      });
      const timeSince = moment(data.date).fromNow();
      return message.reply({
        embeds: [
          new Embed()
            .setAuthor({
              name: mentioned.displayName,
              iconURL: mentioned.displayAvatarURL(),
            })
            .setDescription(
              `I've been AFK since **${timeSince}**.\n> **Reason**: ${data.reason}`
            ),
        ],
      });
    }

    const authorInDb = await db.exists({
      user: message.author.id,
      guild: message.guild.id,
    });

    if (authorInDb && !message.content.startsWith(`${prefix}afk`)) {
      const data = await db.findOneAndDelete({
        user: message.author.id,
        guild: message.guild.id,
      });
      message.reply({
        embeds: [
          new SuccessEmbed().setDescription(
            `Welcome back! You were AFK for **${moment(data.date).fromNow(
              true
            )}**.`
          ),
        ],
      });
    }
  });
};
