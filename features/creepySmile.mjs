import { CronJob } from "cron";
import { AttachmentBuilder } from "discord.js";

/** @type {import('../utils/types.mjs').Feature} */
export default (client) => {
  const job = new CronJob(
    "0 * * * *",
    sendMessage,
    null,
    false,
    "America/Los_Angeles"
  );

  client.on("ready", () => {
    job.start();
  });

  async function sendMessage() {
    const channel = await client.channels.fetch("801498542694334495");
    if (!channel || !channel.isTextBased()) return;

    const file = new AttachmentBuilder(
      "https://cdn.discordapp.com/attachments/739503492187553805/1060320827184263178/nightmare_smile.jpg",
      { name: "nightmare_smile.jpg" }
    );
    channel.send({
      files: [file],
    });
  }
};
