import * as fs from "fs";
import * as path from "path";
import { Message } from "discord.js";

export function recursiveFileParse(
  pathToParse: string
): Array<Array<any>> {
  let currPath = path.join(__dirname, pathToParse);
  let fileReturn: Array<Array<any>> = [];
  if (!fs.existsSync(currPath)) return fileReturn;
  let files = fs.readdirSync(currPath);
  for (let file of files) {
    if (fs.lstatSync(path.join(currPath, file)).isDirectory()) {
      fileReturn.push(...recursiveFileParse(path.join(pathToParse, file)));
    } else {
      try {
        delete require.cache[require.resolve(path.join(currPath, file))];
        fileReturn.push([
          path.join(pathToParse, file),
          require(path.join(currPath, file)) ||
            fs.readFileSync(path.join(currPath, file), "utf-8"),
        ]);
      } catch (err) {
        console.error(err);
      }
    }
  }
  return fileReturn;
}


export function getLocalPerms (message: Message) {
  let permissionLevel = 0;
  // Add rules later for server permissions later.
  return permissionLevel;  
}