import axios from "axios";
import { CronJob } from "cron";
import { abbreviate } from "../utils/functions.mjs";

/** @type {import("../utils/types.mjs").Feature} */
export default (client) => {
  // const job = new CronJob(
  //   "*/10 * * * * *",
  //   updateVideoId,
  //   null,
  //   true,
  //   "America/Los_Angeles"
  // );

  // client.on("ready", () => {
  //   updateVideoId();
  //   job.start();
  // });

  // function generateVideoId() {
  //   const characters =
  //     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //   let videoId = "";
  //   for (let i = 0; i < 11; i++) {
  //     videoId += characters.charAt(
  //       Math.floor(Math.random() * characters.length)
  //     );
  //   }
  //   return videoId;
  // }

  // async function updateVideoId() {
  //   const channel = await client.channels.fetch("1083761718590717995");
  //   if (!channel || !channel.isTextBased()) return;

  //   const videoId = generateVideoId();
  //   axios
  //     .get(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)
  //     .then(async () => {
  //       const message = await channel.send({
  //         content: `Generated video ID: **${videoId}**\n✅ It exists! **<https://youtu.be/${videoId}>**`,
  //       });
  //       message.pin();
  //     })
  //     .catch(() => {
  //       channel.send({
  //         content: `Generated video ID: **${videoId}**\n❌ It does not exist (or it's private).`,
  //       });
  //     });
  // }
};
