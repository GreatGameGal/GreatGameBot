import Discord from "discord.js";
import defaultUserData from "../defaultUserData";

export async function run(this: Bot, message: Discord.Message) {
  let userData =  await this.mongo.db("bot").collection("user").findOne({id: message.author.id});
  if (userData == null) {
    userData = {id: message.author.id};
    Object.assign(userData, defaultUserData);
    this.mongo.db("bot").collection("user").insertOne(userData);
  }
  if (userData.globalPermissions < 0) return;
  if (!message.author.bot) {
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
          if (command != null) {
            command.run(message, args);
          }
        }
      }
    }
  }
}

export const disabled: boolean = false;
export const type: string = "message";
