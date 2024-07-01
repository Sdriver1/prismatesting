import * as Discord from "discord.js";
import { level, xp } from "../currency/configurers/leveling/formula.js";
import { get_currency_balance } from "../currency/operations/arithmetic.js";
import { number_format_commas } from "../util/number_format_commas.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("xp")
    .setDescription("Check your level")
    .addUserOption((option) =>
      option.setName("target").setDescription("The user whose level to check")
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    // Get options
    const target = interaction.options.getUser("target") || interaction.user;
    // Get currency balance
    // Reply with level
    interaction.editReply({
      content: await generate_level_description(target),
    });
  },
  options: {
    server_cooldown: 0,
  },
};

async function generate_level_description(user: Discord.User) {
  let user_id = user.id;
  const user_stats = await get_currency_balance(user_id);
  let output = `
### ${user.displayName}'s Level
${
  user_stats.superprestige > 0
    ? `▸ Super Prestige: **${number_format_commas(user_stats.superprestige)}**`
    : ``
} 
${
  user_stats.prestige > 0
    ? `▸ Prestige: **${number_format_commas(user_stats.prestige)}**`
    : ``
} 
▸ Level: **${number_format_commas(level(user_stats.xp))}**
▸ XP: **${number_format_commas(Math.round(user_stats.xp))}**
▸ XP to next level: **${number_format_commas(
    Math.ceil(xp(level(user_stats.xp) + 1) - user_stats.xp)
  )}**`;
  return output;
}
