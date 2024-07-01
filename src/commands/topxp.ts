import * as Discord from "discord.js";
import { db } from "../startup/db.js";
import SQL from "sql-template-strings";
import { level } from "../currency/configurers/leveling/formula.js";
import { number_format_commas } from "../util/number_format_commas.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("topxp")
    .setDescription("Get the users with the highest XP")
    .addNumberOption((option) =>
      option
        .setName("page")
        .setDescription(
          "The leaderboard page to show (page 1 is 1-10, page 2 is 11-20, etc.)"
        )
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    const page = interaction.options.getNumber("page") || 1;
    if (page > 999 || !Number.isInteger(page) || page < 1) {
      interaction.editReply(
        "Invalid page supplied! (Only whole number pages between 1 and 999 work)"
      );
      return;
    }
    // 1 is subtracted to match the array index
    const indices = {
      max: page * 10 - 1,
      min: page * 10 - 9 - 1,
    };
    const prestige_data = await db.all(
      SQL`SELECT DISTINCT 
      u.user_id, 
      p.amount as prestige, 
      x.amount as xp,
      s.amount as superprestige 
  FROM user_currencies u
  LEFT JOIN user_currencies p ON u.user_id = p.user_id AND p.currency_id = 'prestige'
  LEFT JOIN user_currencies x ON u.user_id = x.user_id AND x.currency_id = 'xp'
  LEFT JOIN user_currencies s ON u.user_id = s.user_id AND s.currency_id = 'superprestige' 
  WHERE p.amount IS NOT NULL OR x.amount IS NOT NULL OR s.amount IS NOT NULL
  ORDER BY superprestige DESC, prestige DESC, xp DESC;
`
    );
    let output_message = ``;
    for (let i = indices.min; i <= indices.max; i++) {
      let user_data = prestige_data[i];
      let user_amount_message = `<@${user_data.user_id}> ▸ `;
      if (!user_data) return;
      if (user_data.superprestige > 0)
        user_amount_message += `Superprestige **${number_format_commas(
          user_data.superprestige
        )}**, `;
      if (user_data.prestige > 0)
        user_amount_message += `Prestige **${number_format_commas(
          user_data.prestige
        )}**, `;
      user_amount_message += `Level **${number_format_commas(
        level(user_data.xp)
      )}**\n`;
      output_message += user_amount_message;
    }
    if (output_message === ``) {
      interaction.editReply("No data exists for specified page");
      return;
    } else {
      output_message +=
        "\n[Click me for more information about Prestige & Super Prestige](https://discord.com/channels/921403338069770280/1212989878485385236)";
      interaction.editReply({
        content: "# XP Leaderboard\n" + output_message,
      });
    }
  },
  options: {
    server_cooldown: 0,
  },
};
