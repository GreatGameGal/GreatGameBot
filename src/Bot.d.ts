namespace Bot {
  interface Permissions {
    local: number | void;
    bot: number | void;
  }

  interface Command {
    run: function;
    aliases: Array<string>;
    disabled: boolean | void;
    perms: Permissions | void;
  }
  
  interface Event {
    run: function;
    type: string;
    disabled: boolean | void;
  }
}


class Bot {
  config: Record<string, any>;
  client: Discord.Client;
  commands: Map<string, Bot.Command>;
  aliases: Map<string, Bot.Command>
  events: Array<Bot.Event>;
  mongo: MongoClient;

  constructor(config: Record<string, any>);
  async loadCommands(): Promise<void>;
  async loadEvents(): Promise<void>;
  async send(
    channel: string | Discord.Channel,
    message: string,
    opts?: Record<string, any>
  ): Promise<Discord.Message | void>;
  setupDatabase (): void;
}