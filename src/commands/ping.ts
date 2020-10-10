import Discord from "discord.js";

export function run (this: Bot, message: Discord.Message, args: Array<string>, perms: Bot.Permissions) {
  let start = Date.now();
  message.channel.send("Pong!").then((msg) => {
    msg.edit(`Pong! (Roundabout ~${Date.now()-start}ms)`);
  } );
}

export const disabled: boolean = false;
export const aliases = [];
export const perms = {
  local: 0,
  bot: 0
}