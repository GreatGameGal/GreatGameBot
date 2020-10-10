import Discord from "discord.js";
import defaultUserData from "../defaultUserData";
import { getLocalPerms } from "../utils";

export async function run(this: Bot, message: Discord.Message) {
  if (!message.author.bot) {
    let userData = await this.mongo
      .db("bot")
      .collection("user")
      .findOne({ id: message.author.id });
    if (userData == null) {
      userData = { id: message.author.id };
      Object.assign(userData, defaultUserData);
      this.mongo.db("bot").collection("user").insertOne(userData);
    }
    if (userData.botPermLevel < 0) return;
    let userPerms: Bot.Permissions = {
      bot: userData.botPermLevel,
      local: getLocalPerms(message),
    };
    for (let i = 0; i < this.config.prefixes.length; i++) {
      const prefix = this.config.prefixes[i];
      if (message.content.startsWith(prefix)) {
        const args = message.content.substr(prefix.length).split(" ");
        let cmd = args.shift();
        if (cmd != null) {
          cmd = cmd.toLowerCase();
          let command = this.commands.has(cmd)
            ? this.commands.get(cmd)
            : this.aliases.get(cmd);
          if (
            command != null &&
            (command.perms == null ||
              (!(userPerms.local < command.perms.local) &&
                !(userPerms.bot < command.perms.bot)))
          ) {
            command.run(message, args, userPerms);
          }
        }
      }
    }
  }
}

export const disabled: boolean = false;
export const type: string = "message";
