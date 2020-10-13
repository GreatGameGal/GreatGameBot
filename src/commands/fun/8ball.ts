import Discord from "discord.js";

const options = [
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes -- definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most Likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "404 Future not found.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful."
]

export async function run(
  this: Bot,
  message: Discord.Message,
  args: Array<string>,
  permissions: Bot.Permissions,
  userData: Bot.UserData,
  memberData: Bot.MemberData,
  guildData: Bot.GuildData
) {
  let text = args.join("").toLowerCase();
  let sum = Math.floor(Date.now() / 120000);
  for(let i=0;i<text.length;i++) {
    sum += text.charCodeAt(i);
  }
  message.channel.send(options[sum % options.length]);


}

export const disabled: boolean = false;
export const aliases = [];
export const perms = {
  local: 0,
  bot: 0,
};
