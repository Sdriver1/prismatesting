import * as Discord from "discord.js";
import { level, xp } from "../configurers/leveling/formula.js";
import config from "../../configs/config.json" assert { type: "json" };
import { update_user_level_roles } from "../../util/level_roles.js";
import { number_format_commas } from "../../util/number_format_commas.js";
import {
  generate_boost_id,
  generate_xp_boost,
} from "../configurers/xp_boosts.js";
import { get_currency_balance, give_reward } from "./arithmetic.js";
import { db } from "../../startup/db.js";
import SQL from "sql-template-strings";
import { activate_boost } from "../../command_parts/xp_boosts.js";
let reward_thresholds;
async function update_reward_thresholds() {
  let rewards = await db.all(SQL`SELECT messages FROM rewards`);
  reward_thresholds = rewards.map((reward) => reward.messages);
}
setInterval(update_reward_thresholds, 60 * 1000);
update_reward_thresholds();

export const xp_system = {
  checker: function (old_value: number, new_value: number) {
    if (level(old_value) < level(new_value)) {
      return true;
    }
    return false;
  },
  process: async function (
    new_value: number,
    user_id: string,
    channel: Discord.TextBasedChannel
  ) {
    if (!channel) return;
    let level_up_message = `### 🎉 Level up, <@${user_id}>!
▸ You have reached level **${number_format_commas(level(new_value))}**!
▸ You'll level up again in **${number_format_commas(
      Math.ceil(xp(level(new_value) + 1) - new_value)
    )}** XP!`;
    const prestige = await get_currency_balance(user_id, "prestige");
    if (level(new_value) >= prestige * 5 + 25)
      level_up_message += `\n▸ **PRESTIGE AVAILABLE!** Type \`/prestige\` to prestige now!`;
    channel
      .send({
        content: level_up_message,
        flags: Discord.MessageFlags.SuppressNotifications,
      })
      .catch((err) => {
        return;
      });
    await update_user_level_roles(user_id, config.server.roles.levels);
  },
};
export const monthly_rewards = {
  checker: function (new_value: number) {
    if (
      reward_thresholds.some((n) => n == new_value) ||
      (new_value > 2000 && new_value % 1000 === 0)
    ) {
      return true;
    }
    return false;
  },
  process: async function (new_value: number, message: Discord.Message) {
    const reward = await db.get(
      SQL`SELECT * FROM rewards WHERE messages = ${new_value}`
    );
    if (!message.channel || !reward) return;
    try {
      await give_reward(message.author.id, new_value);
    } catch (err) {
      console.log(err);
      return;
    }
    let reward_message = `### 🎉 ${number_format_commas(
      new_value
    )} message reward unlocked, ${message.author}!\n`;
    if (reward.xp_boost_multiplier && reward.xp_boost_duration)
      reward_message += `▸ **${reward.xp_boost_multiplier}**x XP for **${
        reward.xp_boost_duration / 1000 / 60
      }** minutes\n`;
    if (reward.currency_to_give && reward.currency_to_give_amount)
      reward_message += `▸ **${number_format_commas(
        reward.currency_to_give_amount
      )}** ${reward.currency_to_give}\n`;
    if (reward.role_id) reward_message += `▸ <@&${reward.role_id}>\n`;
    if (new_value === 5)
      reward_message += `▸ **Grab the Rewards Wager** from </shop:1203120195531440203> to get **MORE REWARDS** when you reach the maximum reward! (We gave you enough gold to buy it!)`;
    await message.channel.send({
      content: reward_message,
      flags: Discord.MessageFlags.SuppressNotifications,
      components: [
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>().addComponents([
          new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Link)
            .setLabel("What do rewards do?")
            .setURL(
              "https://discord.com/channels/921403338069770280/1234282759195721830"
            ),
        ]),
      ],
    });
  },
};
export const first_message = {
  checker: function (old_xp: number, prestige: number, superprestige: number) {
    if (old_xp === 0 && prestige === 0 && superprestige === 0) return true;
    return false;
  },
  process: async function (user_id: string, channel: Discord.TextBasedChannel) {
    if (!channel) return;
    const id = await generate_boost_id();
    channel
      .send({
        content: `# 🎉 5x XP unlocked, <@${user_id}>!`,
        flags: Discord.MessageFlags.SuppressNotifications,
        components: [
          new Discord.ActionRowBuilder<Discord.ButtonBuilder>().addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Primary)
              .setCustomId(`${id}`)
              .setLabel("CLICK ME: Get 5x XP")
          ),
        ],
      })
      .then(async (message) => {
        const collector = await message.createMessageComponentCollector({
          time: 10 * 60 * 1000,
        });
        collector.on("collect", (i) => {
          if (i.user.id !== user_id) {
            i.reply({
              content: "Hey! This isn't your boost! (  •̀ ᴖ •́  )",
              ephemeral: true,
            });
            return;
          } else {
            activate_boost(Number(i.customId), 10 * 60 * 1000);
            i.reply({
              content:
                "**Great job!** You have 5x XP for the next 10 minutes. **You'll get more XP boosts like this the more you chat here!**",
              ephemeral: true,
            });
            message.edit({ components: [] });
          }
        });
      })
      .catch((err) => {
        return;
      });
    await generate_xp_boost({
      multiplier: 5,
      unclaimed_time_ms: 10 * 60 * 1000,
      owner_id: user_id,
      id: id,
    });
  },
};
