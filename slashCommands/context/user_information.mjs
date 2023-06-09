import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { Embed } from "../../structures/Embed.mjs";
import { emojis, badges } from "../../config.mjs";

const statuses = {
  online: `${emojis.online} Online`,
  idle: `${emojis.idle} Idle`,
  dnd: `${emojis.dnd} Do Not Disturb`,
  offline: `${emojis.offline} Offline`,
  invisible: `${emojis.offline} Offline`,
};

/** @type {import("../../utils/types.mjs").ContextMenu} */
export default {
  data: new ContextMenuCommandBuilder()
    .setName("Get user information")
    .setType(ApplicationCommandType.User),
  run: async ({ interaction }) => {
    const { targetUser: user, targetMember: member } = interaction;

    const userFlags = (await user.fetchFlags()).toArray();

    const embed = new Embed()
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL(),
      })
      .setThumbnail(user.displayAvatarURL({ size: 4096 }))
      .setDescription(
        `User information:
        > **Username**: ${user.username}
        > **Discriminator**: #${user.discriminator}
        > **ID**: ${user.id}
        > **Bot**: ${user.bot ? "Yes" : "No"}
        > **Status**: ${statuses[member.presence?.status ?? "offline"]}
        > **Badges**: ${
          userFlags.length > 0
            ? userFlags.map((flag) => badges[flag]).join(" ")
            : "None"
        }
        > **Joined Discord**: <t:${parseInt(user.createdTimestamp / 1000)}:D>

        Member information:
        > **Nickname**: ${member.nickname || "None"}
        > **Joined server**: <t:${parseInt(member.joinedTimestamp / 1000)}:D>
        > **Highest role**: ${member.roles.highest}
        ${
          user.bot
            ? ""
            : `> **Boosting**: ${member.premiumSince ? "Yes" : "No"}\n`
        }
        Stats:
        > *Coming soon!*
        `
      );

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
