/**
 * @typedef {{ prefix: string }} Config
 */

/**
 * @typedef {import("discord.js").ChatInputCommandInteraction & { member: import("discord.js").GuildMember }} Interaction
 */

/**
 * @typedef {Object} Command
 * @prop {string} name
 * @prop {string} [description]
 * @prop {string[]} [aliases]
 * @prop {string} [usage]
 * @prop {string} directory - Added by the handler.
 * @prop {import('discord.js').PermissionResolvable[]} userPermissions
 * @prop {boolean} [botChannelOnly]
 * @prop {(params: { client: import("../structures/BotClient.mjs").BotClient, message: import("discord.js").Message, args: string[] }) => Promise<any>} run
 */

/**
 * @typedef {Object} SlashCommand
 * @prop {import('discord.js').SlashCommandBuilder} data
 * @prop {(params: { client: import("../structures/BotClient.mjs").BotClient, interaction: Interaction, prefix: string }) => Promise<any>} run
 * @prop {(params: { client: import("../structures/BotClient.mjs").BotClient, interaction: Interaction }) => Promise<any>} autocomplete
 */

/**
 * @typedef {Object} ContextMenu
 * @prop {import('discord.js').ContextMenuCommandBuilder} data
 * @prop {(params: { client: import("../structures/BotClient.mjs").BotClient, interaction: import("discord.js").ContextMenuCommandInteraction }) => Promise<any>} run
 */

/** @typedef {(client: import("../structures/BotClient.mjs").BotClient) => Promise<any>} Feature */

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
