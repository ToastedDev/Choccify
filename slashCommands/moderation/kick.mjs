import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed.mjs";

/** @type {import('../../utils/types.mjs').SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a member from the server.")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to kick.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason why you're kicking this member.")
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
            "You can't kick a member that has a higher/equal role to you."
          ),
        ],
        ephemeral: true,
      });
    if (!member.kickable)
      return interaction.reply({
        embeds: [new FailEmbed().setDescription("I can't kick that member.")],
        ephemeral: true,
      });

    const reason =
      interaction.options.getString("reason") || "No reason provided.";

    member
      .send({
        embeds: [
          new FailEmbed().setDescription(
            `You have been kicked from **${interaction.guild.name}**.\n> **Reason**: ${reason}`
          ),
        ],
      })
      .catch(() =>
        console.error(
          `Couldn't DM ${member.user.tag} because they have their DMs off.`
        )
      );

    member.kick(reason);

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `**${member.user.tag}** has been kicked from the server!\n> **Reason**: ${reason}`
        ),
      ],
      ephemeral: true,
    });
  },
};
