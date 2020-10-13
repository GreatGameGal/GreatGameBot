import Discord from "discord.js";

export async function run(
  this: Bot,
  message: Discord.Message,
  args: Array<string>,
  permissions: Bot.Permissions,
  userData: Bot.UserData,
  memberData: Bot.MemberData
) {
  if (memberData != null) {
    message.channel.send(
      `${message.member == null ? message.author.username : message.member.displayName}, you have ${
        memberData.points
      } points in this guild!`
    );
  } else {
    message.channel.send(
      `${
        message.member == null ? message.author.username : message.member.displayName
      }, this command must be used in a guild, global points are not currently supported.`
    );
  }
}

export const disabled: boolean = false;
export const aliases = [];
export const perms = {
  local: 0,
  bot: 0,
};
