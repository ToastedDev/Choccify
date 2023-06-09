import { CronJob } from "cron";
import { guildId } from "../config.mjs";
import { Embed } from "../structures/Embed.mjs";
import db from "../structures/schemas/Birthday.mjs";

/** @type {import("../utils/types.mjs").Feature} */
export default (client) => {
  const job = new CronJob(
    "0 0 * * *",
    checkBirthdays,
    null,
    true,
    "Africa/Abidjan"
  );
  client.on("ready", async () => {
    checkBirthdays();
    job.start();
  });

  function checkBirthdays() {
    client.guilds.cache.get(guildId).members.cache.forEach(async (member) => {
      const data = await db.findOne({ user: member.id }).catch(() => null);
      if (!data) return;

      const now = new Date();
      if (
        (data.lastSent && now.getFullYear() === data.lastSent) ||
        now.getMonth() !== data.month ||
        now.getDate() !== data.day
      )
        return;

      const channel = await client.channels.fetch("790686892227166268");
      if (!channel) return;
      channel.send({
        embeds: [
          new Embed().setDescription(
            `Today is **${member.displayName}**'s birthday! Everyone wish them a happy birthday in <#739503492187553805>!`
          ),
        ],
      });
      data.lastSent = now.getFullYear();
      await data.save();
    });
  }
};
