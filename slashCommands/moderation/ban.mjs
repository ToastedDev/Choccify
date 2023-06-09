import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed.mjs";

/** @type {import('../../utils/types.mjs').SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a member from the server.")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason why you're banning this member.")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  run: async ({ interaction }) => {
    const member = interaction.options.getMember("member");
    if (!member)
      return interaction.reply({
        embeds: [new FailEmbed().setDescription("Member not found.")],
        ephemeral: true,
      });
    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        embeds: [
          new FailEmbed().setDescription(
            "You can't ban a member that has a higher/equal role to you."
          ),
        ],
        ephemeral: true,
      });
    if (!member.bannable)
      return interaction.reply({
        embeds: [new FailEmbed().setDescription("I can't ban that member.")],
        ephemeral: true,
      });

    const reason =
      interaction.options.getString("reason") || "No reason provided.";

    member
      .send({
        embeds: [
          new FailEmbed().setDescription(
            `You have been banned from **${interaction.guild.name}**.\n> **Reason**: ${reason}`
          ),
        ],
      })
      .catch(() =>
        console.error(
          `Couldn't DM ${member.user.tag} because they have their DMs off.`
        )
      );

    member.ban({ reason });

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `**${member.user.tag}** has been banned from the server!\n> **Reason**: ${reason}`
        ),
      ],
      ephemeral: true,
    });
  },
};
