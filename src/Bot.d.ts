interface Command {
  run: function;
  aliases: Array<string>;
  disabled: boolean | void;
}

interface Event {
  run: function;
  type: string;
  disabled: boolean | void;
}

class Bot {
  config: Record<string, any>;
  client: Discord.Client;
  commands: Map<string, Command>;
  aliases: Map<string, string>
  events: Array<Event>;

  constructor(config: Record<string, any>);
  async loadCommands(): Promise<void>;
  async loadEvents(): Promise<void>;
  async send(
    channel: string | Discord.Channel,
    message: string,
    opts?: Record<string, any>
  ): Promise<Discord.Message | void>;
}