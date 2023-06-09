import { SlashCommandBuilder } from "discord.js";
import { Embed } from "../../structures/Embed.mjs";

/** @type {import('../../utils/types.mjs').SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("View the member count of this server."),
  run: async ({ interaction }) => {
    const { guild } = interaction;
    interaction.reply({
      embeds: [
        new Embed().setDescription(
          `**Members**: ${guild.memberCount}\n**Humans**: ${
            guild.members.cache.filter((m) => !m.user.bot).size
          }\n**Bots**: ${guild.members.cache.filter((m) => m.user.bot).size}`
        ),
      ],
    });
  },
};
