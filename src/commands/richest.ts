import * as Discord from "discord.js";
import { get_currency_leaderboard } from "../command_parts/generate_leaderboard.js";
import { number_format_commas } from "../util/number_format_commas.js";
import { random_embed_color } from "../util/random_embed_color.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("richest")
    .setDescription("See who the richest users are")
    .addStringOption((option) =>
      option
        .setName("currency")
        .setDescription(
          "The currency you want to view the leaderboard of (defaults to gold)"
        )
    )
    .addNumberOption((option) =>
      option
        .setName("page")
        .setDescription("The leaderboard page you want to view (defaults to 1)")
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    const currency = interaction.options.getString("currency") || "gold";
    const page = interaction.options.getNumber("page") || 1;
    if (page > 999 || !Number.isInteger(page) || page < 1) {
      interaction.editReply(
        "Invalid page supplied! (Only whole number pages between 1 and 999 work)"
      );
      return;
    }
    // 1 is subtracted to match the array index
    const indices = {
      max: page * 10,
      min: page * 10 - 10,
    };
    const data = {
      min_index: indices.min,
      max_index: indices.max,
      currency_id: currency,
    };
    // Try/catch in case of either error the function throws if the input is wrong
    let leaderboard;
    try {
      leaderboard = await get_currency_leaderboard(data);
    } catch (err) {
      interaction.editReply({ content: `${err}` });
      return;
    }
    let leaderboard_description = "";
    for (let row of leaderboard) {
      if (row)
        leaderboard_description += `<@${
          row.user_id
        }> ▸ **${number_format_commas(row.amount)}** ${data.currency_id}\n`;
    }
    if (!leaderboard_description)
      leaderboard_description =
        "Hmm, there's no data on this page! Try searching again! 🔍:t_rex:";
    let leaderboard_embed = new Discord.EmbedBuilder()
      .setColor(random_embed_color())
      .setTitle(`Leaderboard: ${data.currency_id}`)
      .setDescription(leaderboard_description)
      .setFooter({
        text: `Page ${number_format_commas(page)} ${
          page === 69 || page === 420 ? "(nice)" : ""
        }`,
      });
    interaction.editReply({ embeds: [leaderboard_embed] });
  },
  options: {
    server_cooldown: 0,
  },
};
