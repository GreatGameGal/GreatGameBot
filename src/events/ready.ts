export function run (this: Bot) {
  console.log(`This instance of the bot is online and ready to serve ${this.client.users.cache.size} cached users in ${this.client.guilds.cache.size} cached severs.`)
}

export const disabled: boolean = false;
export const type: string = "ready";