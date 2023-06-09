/**
 * @param {import("../structures/BotClient.mjs").BotClient} client
 * @param {import("discord.js").GuildMember} member
 */
export default async (client, member) => {
  const channel = await member.guild.channels.cache.get("739503492187553805");
  if (channel) channel.send(`${member.user.tag} has left.`);
};
