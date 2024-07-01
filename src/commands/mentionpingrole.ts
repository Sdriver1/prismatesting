import * as Discord from "discord.js";
import config from "../configs/config.json" assert { type: "json" };
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("mention")
    .setDescription("Mention a ping role (only works on ping roles)")
    .addRoleOption((option) =>
      option.setName("role").setDescription("The ping role to mention")
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    const role = interaction.options.getRole("role");
    if (Object.values(config.server.roles.pings).includes(role.id))
      return interaction.editReply("Do not attempt to ping non-ping roles.");
    interaction.channel.send(`${role}`);
    interaction.editReply("Done");
  },
  options: {
    server_cooldown: 0,
  },
};
