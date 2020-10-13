import Discord from "discord.js";
import * as defaultVals from "../../defaultDataVals/index";

async function banUser(this: Bot, id: string, permissions: Bot.Permissions) {}

export async function run(
  this: Bot,
  message: Discord.Message,
  args: Array<string>,
  permissions: Bot.Permissions
) {
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
          if (!userData) {
            userDB.insertOne(
              Object.assign({}, defaultVals.userData, { id, botPermLevel: -1 })
            );
            console.log(`LOG: Banned user ${id}`);
            return `You have bot-banned user '${id}'`;
          }
          if (userData.botPermLevel >= permissions.bot)
            return `You can not ban user '${id}' as you have insufficient permissions.`;
          if (userData.botPermLevel == -1)
            return `You can not ban user '${id}' as they have already been banned`;

          userDB.updateOne({ id }, { $set: { botPermLevel: -1 } });
          console.log(`LOG: Banned user '${id}'`);
          return `You have bot-banned user '${id}'`;
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
  bot: 9,
};
