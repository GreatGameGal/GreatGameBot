import * as fs from "fs";
import Bot from "./bot";

const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
if (fs.existsSync("./config-secret.json"))
  Object.assign(
    config,
    JSON.parse(fs.readFileSync("./config-secret.json", "utf-8"))
  );

const bot = new Bot(config);