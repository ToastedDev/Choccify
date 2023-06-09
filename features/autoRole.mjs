/** @type {import('../utils/types.mjs').Feature} */
export default (client) => {
  client.on("guildMemberAdd", (member) => {
    if (member.user.bot) member.roles.add("744166006473228358");
    else member.roles.add("1103555155934335026");
  });
};
