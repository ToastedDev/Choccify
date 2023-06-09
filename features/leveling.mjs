import Levels from "discord.js-leveling";
import { channels } from "../config.mjs";
import { levelRoles } from "../utils/levelRoles.mjs";

/** @type {import("../utils/types.mjs").Feature} */
export default (client) => {
  client.on("messageCreate", async (message) => {
    if (
      !message.guild ||
      message.guild.id !== "739503491667591249" ||
      message.author.bot ||
      channels.excluded.levels.includes(message.channel.id)
    )
      return;

    const randomXp = Math.floor(Math.random() * 29) + 1;
    const hasLeveledUp = await Levels.appendXp(
      message.author.id,
      message.guild.id,
      randomXp
    );

    const user = await Levels.fetch(message.author.id, message.guild.id);
    const levelRole = levelRoles.find((role) =>
      typeof role.level === "object"
        ? role.level.includes(user.level)
        : role.level >= user.level
    );
    if (levelRole && levelRole.role !== null) {
      if (message.member.roles.cache.has(levelRole)) return;

      const previousLevelRole = levelRoles.find(
        (role) =>
          role.role ===
          message.member.roles.cache.find(
            (role) =>
              role.name.startsWith("Level ") &&
              !role.name.endsWith(
                typeof levelRole.level === "object"
                  ? levelRole.level[0]
                  : levelRole.level
              )
          )?.id
      );
      if (previousLevelRole)
        message.member.roles.remove(previousLevelRole.role);

      message.member.roles.add(levelRole.role);
    }

    if (hasLeveledUp) {
      const user = await Levels.fetch(message.author.id, message.guild.id);
      message.reply(
        `Nice one **${message.author.username}**, you've just advanced to level **${user.level}**!`
      );
    }
  });
};
