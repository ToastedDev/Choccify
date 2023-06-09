import axios from "axios";
import { CronJob } from "cron";
import { abbreviate } from "../utils/functions.mjs";

/** @type {import("../utils/types.mjs").Feature} */
export default (client) => {
  const job = new CronJob(
    "* * * * *",
    updateSubscribers,
    null,
    true,
    "America/Los_Angeles"
  );

  client.on("ready", () => {
    updateSubscribers();
    job.start();
  });

  async function updateSubscribers() {
    const channel = await client.channels.fetch("1056196326213288006");
    if (!channel || !channel.isVoiceBased()) return;

    const { data } = await axios.get(
      "https://livecounts.xyz/api/youtube-live-subscriber-count/live/UCdbCAoWx7GVuRcQXiDRzAbw"
    );

    channel.setName(`Subscribers: ${data.counts[0].toLocaleString()}`);
  }
};
