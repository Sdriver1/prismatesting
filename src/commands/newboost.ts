import * as Discord from "discord.js";
import { generate_xp_boost } from "../currency/configurers/xp_boosts.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("newboost")
    .setDescription("Generate an XP boost for a user")
    .addNumberOption((option) =>
      option
        .setName("multiplier")
        .setDescription(
          "The factor XP is multiplied by while the boost is active"
        )
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("duration")
        .setDescription("The duration (in minutes)")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("owner")
        .setDescription("The user who owns the boost")
        .setRequired(true)
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    const multiplier = interaction.options.getNumber("multiplier");
    const duration = interaction.options.getNumber("duration") * 60 * 1000;
    const owner = interaction.options.getUser("owner");
    try {
      await generate_xp_boost({
        multiplier: multiplier,
        unclaimed_time_ms: duration,
        owner_id: owner.id,
      });
      interaction.editReply({
        content: "Successfuly generated boost.",
      });
    } catch (err) {
      interaction.editReply(
        `**Rats!** I couldn't generate that boost. Error: ${err}`
      );
    }
  },
  options: {
    server_cooldown: 0,
  },
};
