import InvitesTracker from "@androz2091/discord-invites-tracker";

/** @type {import("../utils/types.mjs").Feature} */
export default (client) => {
  const tracker = InvitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true,
  });

  tracker.on("guildMemberAdd", (member, type, invite) => {
    const channel = member.guild.channels.cache.get("739503492187553805");
    if (!channel) return;

    switch (type) {
      case "normal":
        {
          channel.send(
            `${member.user.tag} has joined the server. They were invited by ${invite.inviter.tag}.`
          );
        }
        break;
      case "vanity":
        {
          channel.send(
            `${member.user.tag} has joined the server. They used the vanity URL.`
          );
        }
        break;
      default:
        {
          channel.send(`${member.user.tag} has joined the server.`);
        }
        break;
    }
  });
};
