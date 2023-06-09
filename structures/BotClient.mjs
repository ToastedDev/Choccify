import { Client, Collection, GatewayIntentBits } from "discord.js";
import fs from "fs";
import { guildId } from "../config.mjs";

export class BotClient extends Client {
  /** @type {Collection<string, import("../utils/types.mjs").Command>} */
  commands = new Collection();

  /** @type {Collection<string, import("../utils/types.mjs").SlashCommand>} */
  slashCommands = new Collection();

  /** @param {import("discord.js").ClientOptions} options */
  constructor(options = {}) {
    const logIntents = [
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildVoiceStates,
    ];
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        ...logIntents,
      ],
      ...options,
    });
  }

  init() {
    this.registerModules();
    this.login(process.env.TOKEN);
  }

  async registerModules() {
    // Slash commands
    /** @type {import('discord.js').ApplicationCommandDataResolvable[]} */
    const commands = [];
    fs.readdirSync("./slashCommands").forEach(async (dir) => {
      const commandFiles = fs
        .readdirSync(`./slashCommands/${dir}`)
        .filter((file) => file.endsWith("js"));

      for (const file of commandFiles) {
        const command = await import(`../slashCommands/${dir}/${file}`).then(
          (x) => x.default
        );
        if (!command?.data || !command?.run) return;

        this.slashCommands.set(command.data.toJSON().name, command);
        commands.push(command.data.toJSON());
      }
    });

    this.on("ready", async () => {
      if (guildId || guildId.length) {
        const guild = this.guilds.cache.get(guildId);
        guild?.commands.set(commands);
        console.log(`Registered commands in ${guild}.`);
      } else {
        this.application?.commands.set(commands);
        console.log(`Registered commands globally.`);
      }
    });

    // Events
    const eventFiles = fs
      .readdirSync("./events")
      .filter((file) => file.endsWith("js"));

    for (const file of eventFiles) {
      const event = await import(`../events/${file}`).then((x) => x.default);
      const eventName = file.split(".")[0];
      this.on(eventName, event.bind(null, this));
    }

    // Features
    const featureFiles = fs
      .readdirSync("./features")
      .filter((file) => file.endsWith("js"));

    for (const file of featureFiles) {
      const feature = await import(`../features/${file}`).then(
        (x) => x.default
      );
      feature(this);
    }
  }
}
