import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Embed, FailEmbed } from "../../structures/Embed.mjs";
import fs from "fs";
import { capitalize } from "../../utils/functions.mjs";
import { owners } from "../../config.mjs";

/** @type {import("../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("View my commands."),
  run: async ({ client, interaction }) => {
    const categories = [];

    for (const dir of fs.readdirSync("./slashCommands")) {
      if (dir === "owner" || dir === "context") continue;

      const commands = fs
        .readdirSync(`./slashCommands/${dir}`)
        .filter((file) => file.endsWith("js"));

      const cmds = await Promise.all(
        commands.map(async (command) => {
          let file = await import(`../../slashCommands/${dir}/${command}`).then(
            (x) => x?.default
          );
          if (!file?.data) return false;

          const cmd = client.slashCommands.get(file.data.toJSON().name);
          if (
            cmd?.data.toJSON().default_member_permissions &&
            !interaction.member.permissions.has(
              cmd.data.toJSON().default_member_permissions
            )
          )
            return false;

          return `\`${file.data.toJSON().name}\``;
        })
      ).then((x) => x.filter(Boolean).sort((a, b) => a.localeCompare(b)));

      if (!cmds || !cmds.length) continue;

      categories.push({
        name: `${capitalize(dir)} [${cmds.length}]`,
        value: cmds.join(", "),
      });
    }

    return interaction.reply({
      embeds: [
        new Embed()
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setFields(categories),
      ],
      ephemeral: true,
    });
  },
};
