import * as Discord from "discord.js";
import SQL from "sql-template-strings";
import { db } from "../startup/db.js";
import { number_format_commas } from "../util/number_format_commas.js";

export default {
  data: new Discord.SlashCommandBuilder()
    .setName("showrewards")
    .setDescription("Lists current rewards"),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    const rewards = await db.all(SQL`SELECT * from rewards`);
    let reward_info_message = "";
    if (!rewards[0]) reward_info_message = "There are no configured rewards";
    for (let reward of rewards) {
      reward_info_message += `## ${reward.messages} messages\n`;
      if (reward.xp_boost_duration && reward.xp_boost_multiplier)
        reward_info_message += `▸ **${reward.xp_boost_multiplier}x** XP for **${
          reward.xp_boost_duration / 1000 / 60
        }** minutes\n`;
      if (reward.currency_to_give && reward.currency_to_give_amount)
        reward_info_message += `▸ **${number_format_commas(
          reward.currency_to_give_amount
        )}** ${reward.currency_to_give}\n`;
      if (reward.role_id) reward_info_message += `▸ <@&${reward.role_id}>\n`;
    }
    interaction.editReply({ content: reward_info_message });
  },
  options: {
    server_cooldown: 0,
  },
};
