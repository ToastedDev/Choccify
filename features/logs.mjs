import { AuditLogEvent, ChannelType, WebhookClient } from "discord.js";
import { emojis, prefix, webhook } from "../config.mjs";
import { Embed, FailEmbed, SuccessEmbed } from "../structures/Embed.mjs";

const channelTypes = {
  0: "Text",
  2: "Voice",
  15: "Forum",
  5: "Announcement",
  13: "Stage",
  4: "Category",
  10: "Thread",
  11: "Thread",
  12: "Thread",
};

/** @type {import("../utils/types.mjs").Feature} */
export default (client) => {
  client
    .on("guildBanAdd", async (ban) => {
      const fetchedLogs = await ban.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberBanAdd,
      });
      const banLog = fetchedLogs.entries.first();
      if (!banLog || banLog.target?.id !== ban.user.id)
        sendLogMessage(
          new FailEmbed()
            .setTitle("Member banned")
            .setDescription(
              `**Moderator**: Unknown\n**Reason**: ${
                ban.reason || "No reason specified."
              }`
            )
            .setFooter({
              text: ban.user.username,
              iconURL: ban.user.displayAvatarURL(),
            })
            .setTimestamp()
        );
      else
        sendLogMessage(
          new FailEmbed()
            .setTitle("Member banned")
            .setDescription(
              `**Moderator**: ${banLog.executor.tag}\n**Reason**: ${
                ban.reason || "No reason specified."
              }`
            )
            .setFooter({
              text: ban.user.username,
              iconURL: ban.user.displayAvatarURL(),
            })
            .setTimestamp()
        );
    })
    .on("guildBanRemove", async (ban) => {
      const fetchedLogs = await ban.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberBanRemove,
      });
      const banLog = fetchedLogs.entries.first();
      if (!banLog || banLog.target?.id !== ban.user.id)
        sendLogMessage(
          new SuccessEmbed()
            .setTitle("Member unbanned")
            .setDescription("**Moderator**: Unknown")
            .setFooter({
              text: ban.user.username,
              iconURL: ban.user.displayAvatarURL(),
            })
            .setTimestamp()
        );
      else
        sendLogMessage(
          new SuccessEmbed()
            .setTitle("Member unbanned")
            .setDescription(`**Moderator**: ${banLog.executor.tag}`)
            .setFooter({
              text: ban.user.username,
              iconURL: ban.user.displayAvatarURL(),
            })
            .setTimestamp()
        );
    })
    .on("guildMemberAdd", (member) =>
      sendLogMessage(
        new SuccessEmbed()
          .setTitle("Member joined")
          .setDescription(
            `**ID**: ${member.id}\n**Bot**: ${
              member.user.bot ? emojis.on : emojis.off
            }\n**Joined Discord**: <t:${parseInt(
              member.user.createdTimestamp / 1000
            )}:R>\n**New member count**: ${member.guild.memberCount}`
          )
          .setFooter({
            text: member.displayName,
            iconURL: member.displayAvatarURL(),
          })
          .setTimestamp()
      )
    )
    .on("guildMemberRemove", async (member) => {
      const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberKick,
      });
      const kickLog = fetchedLogs.entries.first();
      if (!kickLog || kickLog.target?.id !== member.id)
        sendLogMessage(
          new FailEmbed()
            .setTitle("Member left")
            .setDescription(
              `**ID**: ${member.id}\n**Bot**: ${
                member.user.bot ? emojis.on : emojis.off
              }\n**Joined Discord**: <t:${parseInt(
                member.user.createdTimestamp / 1000
              )}:R>\n**New member count**: ${member.guild.memberCount}`
            )
            .setFooter({
              text: member.displayName,
              iconURL: member.displayAvatarURL(),
            })
            .setTimestamp()
        );
      else
        sendLogMessage(
          new FailEmbed()
            .setTitle("Member kicked")
            .setDescription(
              `**Moderator**: ${kickLog.executor.tag}\n**Reason**: ${
                kickLog.reason || "No reason specified."
              }`
            )
            .setFooter({
              text: member.displayName,
              iconURL: member.displayAvatarURL(),
            })
            .setTimestamp()
        );
    })
    .on("guildMemberUpdate", async (oldMember, newMember) => {
      const oldRoles = oldMember.roles.cache.filter(
        (x) => !newMember.roles.cache.has(x.id)
      );
      const newRoles = newMember.roles.cache.filter(
        (x) => !oldMember.roles.cache.has(x.id)
      );

      const rolesChanged = newRoles.size > 0 || oldRoles.size > 0;
      if (rolesChanged) {
        let rolesAdded = "";
        if (newRoles.size > 0)
          rolesAdded = newRoles.map((r) => `<@&${r.id}>`).join(" ");

        let rolesRemoved = "";
        if (oldRoles.size > 0)
          rolesRemoved = oldRoles.map((r) => `<@&${r.id}>`).join(" ");

        const embed = new Embed()
          .setTitle("Roles updated")
          .setFooter({
            text: newMember.displayName,
            iconURL: newMember.displayAvatarURL(),
          })
          .setTimestamp();
        if (rolesAdded.length > 0)
          embed.addFields({
            name: "Added",
            value: rolesAdded,
          });
        if (rolesRemoved.length > 0)
          embed.addFields({
            name: "Removed",
            value: rolesRemoved,
          });

        sendLogMessage(embed);
      }

      if (
        !oldMember.isCommunicationDisabled() &&
        newMember.isCommunicationDisabled()
      ) {
        const fetchedLogs = await newMember.guild.fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.MemberUpdate,
        });
        const memberLog = fetchedLogs.entries.first();
        if (
          !memberLog ||
          !memberLog.changes.find(
            (x) => x.key === "communication_disabled_until"
          ) ||
          memberLog.target?.id !== newMember.id
        )
          sendLogMessage(
            new FailEmbed()
              .setTitle("Member muted")
              .setDescription(
                `**Expires on**: <t:${parseInt(
                  newMember.communicationDisabledUntilTimestamp / 1000
                )}:f>\n**Moderator**: Unknown\n**Reason**: Unknown`
              )
              .setFooter({
                text: newMember.displayName,
                iconURL: newMember.displayAvatarURL(),
              })
              .setTimestamp()
          );
        else
          sendLogMessage(
            new FailEmbed()
              .setTitle("Member muted")
              .setDescription(
                `**Expires on**: <t:${parseInt(
                  newMember.communicationDisabledUntilTimestamp / 1000
                )}:f>\n**Moderator**: ${memberLog.executor.tag}\n**Reason**: ${
                  memberLog.reason || "No reason specified."
                }`
              )
              .setFooter({
                text: newMember.displayName,
                iconURL: newMember.displayAvatarURL(),
              })
              .setTimestamp()
          );
      } else if (
        oldMember.isCommunicationDisabled() &&
        !newMember.isCommunicationDisabled()
      ) {
        const fetchedLogs = await newMember.guild.fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.MemberUpdate,
        });
        const memberLog = fetchedLogs.entries.first();
        if (
          !memberLog ||
          !memberLog.changes.find(
            (x) => x.key === "communication_disabled_until"
          ) ||
          memberLog.target?.id !== newMember.id
        )
          sendLogMessage(
            new SuccessEmbed()
              .setTitle("Member unmuted")
              .setDescription(`**Moderator**: Unknown\n**Reason**: Unknown`)
              .setFooter({
                text: newMember.displayName,
                iconURL: newMember.displayAvatarURL(),
              })
              .setTimestamp()
          );
        else
          sendLogMessage(
            new SuccessEmbed()
              .setTitle("Member unmuted")
              .setDescription(
                `**Moderator**: ${memberLog.executor.tag}\n**Reason**: ${
                  memberLog.reason || "No reason specified."
                }`
              )
              .setFooter({
                text: newMember.displayName,
                iconURL: newMember.displayAvatarURL(),
              })
              .setTimestamp()
          );
      }
    })
    .on("channelCreate", (channel) => {
      if (channel.type === ChannelType.DM) return;
      sendLogMessage(
        new SuccessEmbed()
          .setTitle("Channel created")
          .setDescription(
            `**Name**: ${channel.name}\n**Type**: ${
              channelTypes[channel.type]
            }${channel.parent ? `\n**Category**: ${channel.parent.name}` : ""}`
          )
          .setFooter({
            text: channel.guild.name,
            iconURL: channel.guild.iconURL(),
          })
          .setTimestamp()
      );
    })
    .on("channelDelete", (channel) => {
      if (channel.type === ChannelType.DM) return;
      sendLogMessage(
        new FailEmbed()
          .setTitle("Channel deleted")
          .setDescription(
            `**Name**: ${channel.name}\n**Type**: ${
              channelTypes[channel.type]
            }${channel.parent ? `\n**Category**: ${channel.parent.name}` : ""}`
          )
          .setFooter({
            text: channel.guild.name,
            iconURL: channel.guild.iconURL(),
          })
          .setTimestamp()
      );
    })
    .on("channelUpdate", (oldChannel, newChannel) => {
      if (
        oldChannel.type === ChannelType.DM ||
        newChannel.type === ChannelType.DM
      )
        return;

      if (newChannel.name !== oldChannel.name)
        sendLogMessage(
          new Embed()
            .setTitle("Channel name updated")
            .setDescription(
              `**Old name**: ${oldChannel.name}\n**New name**: ${newChannel.name}`
            )
            .setFooter({
              text: newChannel.guild.name,
              iconURL: newChannel.guild.iconURL(),
            })
            .setTimestamp()
        );
    })
    .on("messageDelete", async (message) => {
      if (
        !message.guild ||
        message.channel.type === ChannelType.DM ||
        message.webhookId ||
        ["say", "talk"].includes(
          message.content?.slice(prefix.length).trim().split(/ +/)[0]
        )
      )
        return;

      const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MessageDelete,
      });
      const deletionLog = fetchedLogs.entries.find(
        (l) =>
          l.target?.id === message.author?.id &&
          l.extra.channel?.id === message.channel.id &&
          Date.now() - l.createdTimestamp < 20000
      );
      if (!deletionLog || deletionLog.target?.id !== message.author.id)
        sendLogMessage(
          new FailEmbed()
            .setTitle("Message deleted")
            .setDescription(
              `**Content**: ${message.content}\n**Channel**: ${message.channel}\n**Deleter**: Unknown`
            )
            .setFooter({
              text: message.member?.displayName || "Unknown",
              iconURL: message.member?.displayAvatarURL(),
            })
            .setTimestamp()
        );
      else
        sendLogMessage(
          new FailEmbed()
            .setTitle("Message deleted")
            .setDescription(
              `**Content**: ${message.content}\n**Channel**: ${message.channel}\n**Deleter**: ${deletionLog.executor.tag}`
            )
            .setFooter({
              text: message.member?.displayName || "Unknown",
              iconURL: message.member?.displayAvatarURL(),
            })
            .setTimestamp()
        );
    })
    .on("messageDeleteBulk", (messages) => {
      const { guild, channel } = [...messages.values()][0];
      sendLogMessage(
        new FailEmbed()
          .setTitle("Messages purged")
          .setDescription(
            `**Amount deleted**: ${messages.size}\n**Channel**: ${channel}`
          )
          .setFooter({
            text: guild?.name,
            iconURL: guild?.iconURL(),
          })
          .setTimestamp()
      );
    })
    .on("messageUpdate", (oldMessage, newMessage) => {
      if (
        oldMessage.webhookId ||
        oldMessage.author?.bot ||
        oldMessage.content === newMessage.content
      )
        return;
      sendLogMessage(
        new Embed()
          .setTitle("Message updated")
          .setDescription(
            `**Channel**: ${oldMessage.channel} ([Jump](${oldMessage.url}))\n**Before**: ${oldMessage.content}\n**After**: ${newMessage.content}`
          )
          .setFooter({
            text: oldMessage.member?.displayName || "Unknown",
            iconURL: oldMessage.member?.displayAvatarURL(),
          })
          .setTimestamp()
      );
    })
    .on("voiceStateUpdate", (oldState, newState) => {
      if (!oldState.channel && newState.channel)
        return sendLogMessage(
          new Embed()
            .setTitle("Joined voice channel")
            .setDescription(
              `**Channel**: ${newState.channel}\n**Muted**: ${
                newState.mute ? emojis.on : emojis.off
              }\n**Deafened**: ${
                newState.deaf ? emojis.on : emojis.off
              }\n**Server muted**: ${
                newState.serverMute ? emojis.on : emojis.off
              }\n**Server deafened**: ${
                newState.serverDeaf ? emojis.on : emojis.off
              }`
            )
            .setFooter({
              text: newState.member.displayName,
              iconURL: newState.member.displayAvatarURL(),
            })
            .setTimestamp()
        );
      else if (oldState.channel && !newState.channel)
        return sendLogMessage(
          new Embed()
            .setTitle("Left voice channel")
            .setDescription(
              `**Channel**: ${oldState.channel}\n**Muted**: ${
                oldState.mute ? emojis.on : emojis.off
              }\n**Deafened**: ${
                oldState.deaf ? emojis.on : emojis.off
              }\n**Server muted**: ${
                oldState.serverMute ? emojis.on : emojis.off
              }\n**Server deafened**: ${
                oldState.serverDeaf ? emojis.on : emojis.off
              }`
            )
            .setFooter({
              text: oldState.member.displayName,
              iconURL: oldState.member.displayAvatarURL(),
            })
            .setTimestamp()
        );

      sendLogMessage(
        new Embed()
          .setTitle("Voice state updated")
          .addFields(
            {
              name: "Before",
              value: `**Channel**: ${oldState.channel}\n**Muted**: ${
                oldState.mute ? emojis.on : emojis.off
              }\n**Deafened**: ${
                oldState.deaf ? emojis.on : emojis.off
              }\n**Server muted**: ${
                oldState.serverMute ? emojis.on : emojis.off
              }\n**Server deafened**: ${
                oldState.serverDeaf ? emojis.on : emojis.off
              }`,
              inline: true,
            },
            {
              name: "After",
              value: `**Channel**: ${newState.channel}\n**Muted**: ${
                newState.mute ? emojis.on : emojis.off
              }\n**Deafened**: ${
                newState.deaf ? emojis.on : emojis.off
              }\n**Server muted**: ${
                newState.serverMute ? emojis.on : emojis.off
              }\n**Server deafened**: ${
                newState.serverDeaf ? emojis.on : emojis.off
              }`,
              inline: true,
            }
          )
          .setFooter({
            text: oldState.member.displayName,
            iconURL: oldState.member.displayAvatarURL(),
          })
          .setTimestamp()
      );
    });
};

/**
 * @param {import("discord.js").EmbedBuilder} embed
 */
export function sendLogMessage(embed) {
  const hook = new WebhookClient({
    id: webhook[0].id,
    token: webhook[0].token,
  });
  if (!hook) return;
  hook.send({
    embeds: [embed],
  });
}
