import { FailEmbed } from "../structures/Embed.mjs";
import { blacklistedWords } from "../utils/blacklistedWords.mjs";
import { removeFormatting } from "../utils/functions.mjs";

/** @type {import("../utils/types.mjs").Feature} */
export default (client) => {
  client.on("messageCreate", (message) => {
    if (
      !message.guild ||
      !blacklistedWords.some((word) =>
        removeFormatting(message.content.toLowerCase()).includes(word)
      )
    )
      return;
    message.delete();
    message.channel.send({
      content: `<@${message.author.id}>`,
      embeds: [
        new FailEmbed().setDescription(
          "The message you sent has been deleted due to having one or more words that we do not allow in this server."
        ),
      ],
    });
  });
};
