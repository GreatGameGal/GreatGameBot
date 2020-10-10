import Discord from "discord.js";
import defaultUserData from "../defaultUserData";


export async function run (this: Bot, message: Discord.Message, args: Array<string>, permissions: Bot.Permissions) {
  if (args.length == 0) {
    message.channel.send(`Please mention a user to ban from the bot.`);
    return;
  }
  let returnVal: Array<string> = [];

  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    let id = arg;
    if (id.indexOf("<@!") == 0 && id.includes(">") && message.mentions)
      id = id.slice(3, id.indexOf(">"));

      let toPush = await await this.client.users.fetch(id).then(
        async () => {
          let userDB = this.mongo.db("bot").collection("user");
          return await userDB.findOne({ id }).then((userData: any) => {
            if (!userData || userData.botPermLevel != -1)
              return `You can not unban user '${id}' as they have not been banned.`;
  
            userDB.updateOne({ id }, { $set: { botPermLevel: 0 } });
            console.log(`LOG: '${message.author.id}' unbanned user '${id}'`);
            return `You have unbot-banned user '${id}'`;
          });
        },
        async () => {
          return `'${arg}' is not a valid argument for this command.`;
        }
      );
      returnVal.push(toPush);
  }


  message.channel.send(returnVal.join("\n"), { code: returnVal.length > 1 });
}

export const disabled: boolean = false;
export const aliases = [];
export const perms = {
  local: 0,
  bot: 9
}