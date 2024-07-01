import { client } from "../startup/client.js";
import config from "../configs/config.json" assert { type: "json" };
import * as Discord from "discord.js";
import "dotenv/config";
import * as fs from "fs";
const rest = new Discord.REST().setToken(config.bot.token);

export async function get_commands(): Promise<any[]> {
  const commands = [];
  const files = fs.readdirSync("./src/commands");

  for (const file of files) {
    const command = await import(`../commands/${file.replace(".ts", ".js")}`);
    commands.push(command.default);
  }
  return commands;
}
export async function register_commands(): Promise<void> {
  const commands = await get_commands();
  const application_commands = Discord.Routes.applicationCommands(
    client.user.id
  );
  await rest.put(application_commands, {
    body: commands.map((c) => c.data.toJSON()),
  });
}
