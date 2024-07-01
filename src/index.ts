import "dotenv/config";

import { client } from "./startup/client.js";
import { ready } from "./events/ready.js";
import { interactionCreate } from "./events/interactionCreate.js";
import { messageCreate } from "./events/messageCreate.js";
import { guildCreate } from "./events/guildCreate.js";
import { guildBanAdd } from "./events/guildBanAdd.js";
import { guildMemberRemove } from "./events/guildMemberRemove.js";
import { guildMemberUpdate } from "./events/guildMemberUpdate.js";
import { GuildMember } from "discord.js";
import config from "./configs/config.json" assert { type: "json" };

console.log("Loading Star...");

client.once("ready", ready);
client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isChatInputCommand() || interaction.isContextMenuCommand())
      await interaction.deferReply({ ephemeral: true });
    await interactionCreate(interaction);
  } catch (err) {
    interaction.channel.send(
      "**Sorry I didn't reply!** You're probably seeing this because I just restarted, so wait 15 minutes and try again."
    );
    return;
  }
});
client.on("messageCreate", (message) => messageCreate(message));
client.on("guildCreate", (guild) => guildCreate(guild));
client.on("guildBanAdd", (ban) => guildBanAdd(ban));
client.on("guildMemberRemove", (member) =>
  guildMemberRemove(member as GuildMember)
);
client.on("guildMemberUpdate", (oldMember, newMember) =>
  guildMemberUpdate(oldMember as GuildMember, newMember)
);

await client.login(config.bot.token);
