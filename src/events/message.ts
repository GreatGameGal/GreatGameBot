import Discord from "discord.js";

export async function run(this: Bot, message: Discord.Message) {
  let userPermissionData =  await this.mongo.db("user").collection("permissions").findOne({id: message.author.id});
  if (userPermissionData && userPermissionData.banned) return;
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
