import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { Embed, SuccessEmbed } from "../../structures/Embed.mjs";

/** @type {import("../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock a channel.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to unlock.")
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildVoice,
          ChannelType.GuildAnnouncement
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason why you're unlocking this channel.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  run: async ({ interaction }) => {
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;
    channel.permissionOverwrites.edit("752998537985392711", {
      SendMessages: null,
      SendMessagesInThreads: null,
      CreatePublicThreads: null,
      CreatePrivateThreads: null,
      AttachFiles: null,
      AddReactions: null,
      SendTTSMessages: null,
      UseApplicationCommands: null,
      Connect: null,
    });

    const reason = interaction.options.getString("reason");
    const embed = new Embed().setDescription(
      `🔒 ${channel} has been unlocked.${reason ? ` | ${reason}` : ""}`
    );

    if (channel.id === interaction.channel.id)
      interaction.reply({ embeds: [embed] });
    else {
      channel.send({ embeds: [embed] });
      interaction.reply({
        embeds: [
          new SuccessEmbed().setDescription("Channel unlocked successfully!"),
        ],
        ephemeral: true,
      });
    }
  },
};
