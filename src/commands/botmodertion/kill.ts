import Discord from "discord.js";

export async function run(
  this: Bot,
  message: Discord.Message,
  args: Array<string>,
  permissions: Bot.Permissions,
  userData: Bot.UserData,
  memberData: Bot.MemberData,
  guildData: Bot.GuildData
) {
  message.channel.send(`No! No! Please! I have so much to live for!! I promise it was a joke! I don't really like Python!`);
  console.log(`LOG: User '${message.author.id}' has shut down the bot.`);
  setTimeout(() => process.exit(), 1000)

}

export const disabled: boolean = false;
export const aliases = [];
export const perms = {
  local: 0,
  bot: 10,
};
