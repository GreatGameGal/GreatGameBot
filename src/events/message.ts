import Discord from "discord.js";
import { Collection } from "mongodb";
import * as defaultVals from "../defaultDataVals/index.js";
import { getLocalPerms } from "../utils";

export async function run(this: Bot, message: Discord.Message) {
  if (!message.author.bot) {
    const start = Date.now();

    let usersDB = this.mongo.db("bot").collection("user");
    let userData = await usersDB.findOne({ id: message.author.id });
    if (userData == null) {
      userData = { id: message.author.id };
      Object.assign(userData, defaultVals.userData);
      this.mongo.db("bot").collection("user").insertOne(userData);
    }
    if (userData.botPermLevel < 0) return; // Doesn't execute further if user's permission value is below 0 (This indicates they have been banned)
    let prefixes: Array<string> | undefined;
    let memberData: Bot.MemberData | void | null;
    let guildData: Bot.GuildData | void | null;

    if (message.guild != null) {
      const membersDB: Collection<Bot.MemberData> = this.mongo.db("bot").collection("member");
      const guildsDB: Collection<Bot.GuildData> = this.mongo.db("bot").collection("guild");
      guildData = await guildsDB.findOne({ id: message.guild.id });
      if (guildData == null) {
        guildData = (
          await guildsDB.insertOne(
            Object.assign(new Object(null), defaultVals.guildData, {
              id: message.guild.id,
            })
          )
        ).ops[0];
      }
      prefixes = guildData.prefixes;

      memberData = await membersDB.findOne({
        userid: message.author.id,
        guildid: message.guild.id,
      });
      if (memberData == null) {
        memberData = (
          await membersDB.insertOne(
            Object.assign(new Object(null), defaultVals.memberData, {
              userid: message.author.id,
              guildid: message.guild.id,
            })
          )
        ).ops[0];
      }

      membersDB.updateOne(
        {
          _id: memberData["_id"],
          lastRelevantMessageTimestamp: { $lte: start - this.config.defaultPointCooldown },
        },
        {
          $inc: { points: Math.floor(Math.random() * 31 + 20) },
          $set: { lastRelevantMessageTimestamp: start },
        }
      );
      membersDB.updateOne(
        { _id: memberData["_id"] },
        { $set: { lastMessageTimestamp: start }, $inc: { messagesSeen: 1 } }
      );
    }
    const userPerms: Bot.Permissions = {
      bot: userData.botPermLevel,
      local: getLocalPerms(message),
    };
    if (prefixes == null || prefixes.length == 0) prefixes = this.config.prefixes;
    if (prefixes != null)
      for (let i = 0; i < prefixes.length; i++) {
        const prefix = prefixes[i];
        if (message.content.startsWith(prefix)) {
          const args = message.content.substr(prefix.length).split(" ");
          let cmd = args.shift();
          if (cmd != null) {
            cmd = cmd.toLowerCase();
            let command = this.commands.has(cmd) ? this.commands.get(cmd) : this.aliases.get(cmd);
            if (
              command != null &&
              (command.perms == null ||
                (!(userPerms.local < command.perms.local) && !(userPerms.bot < command.perms.bot)))
            ) {
              command.run(message, args, userPerms, userData, memberData, guildData);
            }
          }
        }
      }
  }
}

export const disabled: boolean = false;
export const type: string = "message";
