import * as Discord from "discord.js";
import { client } from "../startup/client.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("status")
    .setDescription("Set my status!")
    .addStringOption((option) =>
      option
        .setName("presence")
        .setDescription("My presence (the green/yellow/red dot)")
        .addChoices(
          { name: "Online (green)", value: "online" },
          { name: "Idle (yellow)", value: "idle" },
          { name: "Do Not Disturb (red)", value: "dnd" },
          { name: "Invisible (gray (appears offline))", value: "invisible" }
        )
    )
    .addStringOption((option) =>
      option.setName("status").setDescription("The custom status message")
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    const bot_data = {
      presence: client.user.presence.status,
      status: client.user.presence.activities[0]
        ? client.user.presence.activities[0].state
        : "",
    };
    const new_bot_data = {
      presence:
        (interaction.options.getString(
          "presence"
        ) as Discord.PresenceStatusData) ||
        (bot_data.presence as Discord.PresenceStatusData),
      status: interaction.options.getString("status") || bot_data.status,
    };
    client.user.setPresence({
      activities: [
        {
          type: Discord.ActivityType.Custom,
          name: "custom",
          state: new_bot_data.status,
        },
      ],
      status: new_bot_data.presence,
    });
    interaction.editReply("**Great choice!** Status set.");
  },
  options: {
    server_cooldown: 0,
  },
};
