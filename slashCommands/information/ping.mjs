import { SlashCommandBuilder } from "discord.js";
import { Embed } from "../../structures/Embed.mjs";

/** @type {import('../../utils/types.mjs').SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pings the bot."),
  run: async ({ client, interaction }) => {
    const res = await interaction.deferReply({
      ephemeral: true,
      fetchReply: true,
    });

    const ping = res.createdTimestamp - interaction.createdTimestamp;

    interaction.followUp({
      embeds: [
        new Embed().setDescription(
          `**🧠 Bot**: ${ping}ms\n**📶 API**: ${client.ws.ping}ms`
        ),
      ],
    });
  },
};
