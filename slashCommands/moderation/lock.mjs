import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { Embed, SuccessEmbed } from "../../structures/Embed.mjs";

/** @type {import("../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock a channel.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to lock.")
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
        .setDescription("The reason why you're locking this channel.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  run: async ({ interaction }) => {
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;
    channel.permissionOverwrites.edit("752998537985392711", {
      SendMessages: false,
      SendMessagesInThreads: false,
      CreatePublicThreads: false,
      CreatePrivateThreads: false,
      AttachFiles: false,
      AddReactions: false,
      SendTTSMessages: false,
      UseApplicationCommands: false,
      Connect: false,
    });

    const reason = interaction.options.getString("reason");
    const embed = new Embed().setDescription(
      `🔒 ${channel} has been locked.${reason ? ` | ${reason}` : ""}`
    );

    if (channel.id === interaction.channel.id)
      interaction.reply({ embeds: [embed] });
    else {
      channel.send({ embeds: [embed] });
      interaction.reply({
        embeds: [
          new SuccessEmbed().setDescription("Channel locked successfully!"),
        ],
        ephemeral: true,
      });
    }
  },
};
