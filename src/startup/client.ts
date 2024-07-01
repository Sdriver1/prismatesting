import * as Discord from "discord.js";
import config from "../configs/config.json" assert { type: "json" };
const ping_roles = [
  ...new Set(Object.values(config.server.roles.pings)),
].filter((id) => id !== "");

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.DirectMessageReactions,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Discord.Partials.Channel],
  allowedMentions: {
    roles: ping_roles,
  },
});

export { client };
