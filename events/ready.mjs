import { prefix, webhook } from "../config.mjs";
import fs from "fs";
import { ActivityType } from "discord.js";
import ms from "ms";
import { abbreviate } from "../utils/functions.mjs";

/** @param {import("../structures/BotClient.mjs").BotClient} client */
export default async (client) => {
  if (!webhook || webhook.length === 0) {
    const channel = await client.channels.fetch("1050373807237505054");
    if (!channel) return;
    const hook = await channel.createWebhook({
      name: `${client.user.username} Logs`,
      avatar: client.user.displayAvatarURL(),
    });
    webhook.push({
      id: hook.id,
      token: hook.token,
    });
    fs.writeFileSync(
      "./.env",
      `TOKEN=${process.env.TOKEN}\nMONGODB_URL="${process.env.MONGODB_URL}"\nWEBHOOK_ID=${hook.id}\nWEBHOOK_TOKEN=${hook.token}`
    );
  }

  console.log(`Logged in as ${client.user.tag}.`);

  /** @type {import("discord.js").ActivityOptions[]} */
  const activities = [
    { name: "Choccy Statistics", type: ActivityType.Watching },
    { name: "Graphify", type: ActivityType.Watching },
    {
      name: `${abbreviate(client.users.cache.size)} users`,
      type: ActivityType.Watching,
    },
    { name: "/help", type: ActivityType.Watching },
    { name: "NCS music", type: ActivityType.Listening },
    { name: "MrBeast's sub count", type: ActivityType.Watching },
    { name: "with Choccy 2", type: ActivityType.Playing },
    { name: "wife & daughter", type: ActivityType.Watching },
  ];
  let index = 0;

  changeActivity();
  setInterval(changeActivity, ms("10s"));

  function changeActivity() {
    if (index === activities.length) index = 0;
    client.user.setActivity(activities[index]);
    index += 1;
  }
};
