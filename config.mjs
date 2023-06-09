export const colors = {
  main: "#ee4efc",
  success: "#00ff00",
  fail: "#ff0000",
};
export const channels = {
  excluded: {
    levels: ["790690187893932032", "801498542694334495", "833860229648613446"],
  },
  logs: "1050373807237505054",
};
export const emojis = {
  on: "✅",
  off: "❌",
  online: "<:online:1053524642867970078>",
  idle: "<:idle:1053524639273467934>",
  dnd: "<:dnd:1053524637256011848>",
  offline: "<:offline:1053524640980533320>",
};
/** @type {Record<import("discord.js").UserFlagsString, string>} */
export const badges = {
  ActiveDeveloper: "<:active_developer:1053528074857234432>",
  HypeSquadOnlineHouse1: "<:house_bravery:1053529404816506990>",
  HypeSquadOnlineHouse2: "<:house_brilliance:1053529406292897824>",
  HypeSquadOnlineHouse3: "<:house_balance:1053529402954231808>",
  Hypesquad: "<:hypesquad_events:1053529408507478026>",
  Partner: "<:partner:1053531222724321401>",
  PremiumEarlySupporter: "<:early_supporter:1053529401276514414>",
  Staff: "<:staff:1053531537984983121>",
  VerifiedBot: "<:verified_bot:1053531981784305734>",
  VerifiedDeveloper: "<:verified_developer:1053531984875499550>",
};
export const owners = ["471702054616825868", "955408387905048637"];

export const prefix = ">";
export const guildId = "739503491667591249";

export const webhook = [];
if (process.env.WEBHOOK_ID && process.env.WEBHOOK_TOKEN)
  webhook.push({
    id: process.env.WEBHOOK_ID,
    token: process.env.WEBHOOK_TOKEN,
  });
