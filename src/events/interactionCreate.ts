import * as Discord from "discord.js";
import { get_commands } from "../startup/commands.js";
import { db } from "../startup/db.js";
import SQL from "sql-template-strings";
let commands = [];

export async function interactionCreate(interaction: Discord.Interaction) {
  if (
    interaction instanceof Discord.ChatInputCommandInteraction ||
    interaction instanceof Discord.ContextMenuCommandInteraction
  ) {
    if (!commands[0]) {
      try {
        commands = await get_commands();
      } catch (err) {
        console.log(err);
      }
    }
    const command = commands.find(
      (c) => c.data.name === interaction.commandName
    );
    if (command.options.server_cooldown) {
      let next_available_timestamp = await get_command_cooldown(
        interaction.commandName
      );
      if (next_available_timestamp > Date.now()) {
        interaction.editReply({
          content: `# This command is on cooldown :(\n▸ It will be available <t:${Math.round(
            next_available_timestamp / 1000
          )}:R>`,
        });
        return;
      }
    }
    try {
      await command.run(interaction);
    } catch (err) {
      interaction.editReply({
        content: `### :bug: You've reached The Failsafe
▸ The Failsafe is a place where you end up when your command errors and it's caught by the bot's failsafe instead of the command itself.
▸ Here's the error. If it doesn't make sense, let a developer know what the message is and how you got here.
\`\`\`${err}\`\`\``,
      });
    }
    if (command.options.server_cooldown)
      set_command_cooldown(
        interaction.commandName,
        Date.now() + command.options.server_cooldown
      );
  }
}

async function get_command_cooldown(command_name: string) {
  const cooldown_data = await db.get(
    SQL`SELECT next_available_timestamp from server_command_cooldowns WHERE name = ${command_name}`
  );
  if (!cooldown_data) return 0;
  return cooldown_data.next_available_timestamp;
}

async function set_command_cooldown(command_name: string, timestamp: number) {
  const cooldown_data = await db.get(
    SQL`SELECT next_available_timestamp from server_command_cooldowns WHERE name = ${command_name}`
  );
  if (cooldown_data == undefined)
    await db.run(
      SQL`INSERT INTO server_command_cooldowns (name, next_available_timestamp) VALUES (${command_name}, ${timestamp})`
    );
  else {
    await db.run(
      SQL`UPDATE server_command_cooldowns SET next_available_timestamp = ${timestamp} WHERE name = ${command_name}`
    );
  }
}
