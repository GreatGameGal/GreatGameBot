const DEFAULT_CONFIG = {
  prefixes: ["?"],
};

import Discord from "discord.js";
import { recursiveFileParse } from "./utils";

export default class Bot {
  config: Record<string, any>;
  client: Discord.Client;
  commands: Map<string, Command>;
  aliases: Map<string, string>
  events: Array<Event>;

  constructor(config: Record<string, any>) {
    this.client = new Discord.Client();
    this.config = new Object(null);
    this.commands = new Map();
    this.aliases = new Map();
    this.events = [];
    if (typeof config.token !== "string") {
      console.trace("ERROR: Config did not contain valid token string.");
      return;
    }
    Object.assign(this.config, DEFAULT_CONFIG, config);

    this.loadCommands();
    this.loadEvents();

    this.client.login(this.config.token);
  }

  async loadCommands(): Promise<void> {
    const start = Date.now();
    if (this.commands.size) this.commands.clear();
    if (this.aliases.size) this.aliases.clear();
    const commandFiles = recursiveFileParse("commands");
    for (let file of commandFiles) {
      let command: Command = file[1] as Command;
      if (!command.disabled && typeof command.run == "function") {
        let splitFilePath = file[0].split("/");
        let fileName = splitFilePath[splitFilePath.length-1]
        let name = fileName.substr(0, fileName.lastIndexOf("."));
        if (this.commands.has(name)) console.warn(`Overwriting existing command ${name}.`)
        this.commands.set(name, command);
        if (command.aliases) for(let i=0;i<command.aliases.length;i++) {
          let alias = command.aliases[i]
          if (this.aliases.has(alias)) console.warn(`Overwriting existing alias ${alias} for command ${name}`)
          this.aliases.set(alias, name);
        }
      }
    }

    console.log(
      `Loaded ${this.commands.size} commands in ${Date.now() - start}ms.`
    );
  }

  async loadEvents(): Promise<void> {
    const start = Date.now();
    for(let i=this.events.length;i>0;i--) {
      let event = this.events.pop() as Event;
      this.client.removeListener(event.type, event.run);
    }
    const eventFiles = recursiveFileParse("events");
    for (let file of eventFiles) {
      let event: Event = file[1] as Event;
      if (!event.disabled && typeof event.run == "function") {
        event.run = event.run.bind(this);
        this.client.addListener(event.type, event.run)
        this.events.push(event);
      }
    }
    console.log(
      `Loaded ${this.events.length} events in ${Date.now() - start}ms.`
    );
  }

  async send(
    channel: string | Discord.Channel,
    message: string,
    opts?: Record<string, any>
  ): Promise<Discord.Message | void> {
    if (!(channel instanceof Discord.Channel))
      channel = await this.client.channels.fetch(channel);
    if (!(channel instanceof Discord.TextChannel)) {
      console.trace("Error: Tried to send a text message to a voice channel.");
      return;
    }

    return await channel.send(message, opts);
  }
}