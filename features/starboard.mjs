import { AttachmentBuilder } from "discord.js";
import { Embed } from "../structures/Embed.mjs";

/** @type {import("../utils/types.mjs").Feature} */
export default (client) => {
  /**
   * @param {import("discord.js").MessageReaction} reaction
   * @returns
   */
  async function handleStarboard(reaction) {
    const { message } = reaction;

    let files = [];
    if (message.attachments.size > 0) {
      if (
        !["png", "jpeg", "jpg", "gif", "webp"].some((i) =>
          message.attachments.first()?.url?.toLowerCase()?.includes(i)
        )
      )
        files = [];
      files = [
        new AttachmentBuilder(message.attachments.first()?.url, {
          name: "image.png",
        }),
      ];
    }

    const embeds = [
      new Embed()
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(
          `${
            message.content ?? ""
          }\n\n[**Click to jump to message!**](https://discord.com/channels/${
            message.guild.id
          }/${message.channel.id}/${message.id})`
        )
        .setFooter({
          text: `Message ID: ${message.id}`,
        })
        .setTimestamp(),
    ];

    if (files.length > 0) embeds[0].setImage("attachment://image.png");

    const channel = await client.channels.fetch("1048945707031216169");
    const msgs = await channel.messages.fetch({ limit: 100 });
    const sentMsg = msgs.find((msg) =>
      msg.embeds.length === 1
        ? msg.embeds[0].footer.text.endsWith(message.id)
          ? true
          : false
        : false
    );

    if (sentMsg)
      sentMsg.edit({
        content: `⭐ **${reaction.count}** | ${message.channel}`,
        embeds,
        files,
      });
    else {
      if (reaction.count < 3) return;
      channel.send({
        content: `⭐ **${reaction.count}** | ${message.channel}`,
        embeds,
        files,
      });
    }
  }

  client.on("messageReactionAdd", async (reaction) => {
    if (
      reaction.emoji.name !== "⭐" &&
      reaction.message.channel.name.toLowerCase() !== "starboard"
    )
      return;

    if (reaction.message.partial) {
      await reaction.message.fetch();
      await reaction.fetch();
      handleStarboard(reaction);
    } else handleStarboard(reaction);
  });

  client.on("messageReactionRemove", async (reaction) => {
    if (
      reaction.emoji.name !== "⭐" &&
      reaction.message.channel.name.toLowerCase() !== "starboard"
    )
      return;

    if (reaction.message.partial) {
      await reaction.message.fetch();
      await reaction.fetch();
      handleStarboard(reaction);
    } else handleStarboard(reaction);
  });
};
