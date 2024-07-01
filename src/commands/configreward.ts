import * as Discord from "discord.js";
import SQL from "sql-template-strings";
import { db } from "../startup/db.js";

export default {
  data: new Discord.SlashCommandBuilder()
    .setName("configreward")
    .setDescription("Create/edit a reward (based on monthlymessages)")
    .addNumberOption((option) =>
      option
        .setName("messages")
        .setDescription("The amount of monthlymessages the reward is given at")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("xp_boost_multiplier")
        .setDescription("The XP boost multiplier at this milestone")
    )
    .addNumberOption((option) =>
      option
        .setName("xp_boost_duration")
        .setDescription("The XP boost duration at this milestone")
    )
    .addStringOption((option) =>
      option
        .setName("reward_currency")
        .setDescription("The currency to give at this milestone")
    )
    .addNumberOption((option) =>
      option
        .setName("reward_currency_amount")
        .setDescription("The amount of currency_name to give at this milestone")
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to give at this milestone")
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    const messages = interaction.options.getNumber("messages");
    const xp_boost = {
      multiplier:
        interaction.options.getNumber("xp_boost_multiplier") || undefined,
      duration:
        interaction.options.getNumber("xp_boost_duration") * 60 * 1000 ||
        undefined,
    };
    const currency = {
      name: interaction.options.getString("reward_currency") || undefined,
      amount:
        interaction.options.getNumber("reward_currency_amount") || undefined,
    };
    const role = interaction.options.getRole("role");
    let role_id = undefined;
    if (role) role_id = role.id;

    const reward = await db.get(
      SQL`SELECT * FROM rewards WHERE messages = ${messages}`
    );
    if (!reward)
      await db.run(
        SQL`INSERT INTO rewards (messages, xp_boost_multiplier, xp_boost_duration, currency_to_give, currency_to_give_amount, role_id) 
        VALUES (${messages}, ${xp_boost.multiplier}, ${xp_boost.duration}, ${currency.name}, ${currency.amount}, ${role_id})`
      );
    else {
      await db.run(
        SQL`UPDATE rewards SET xp_boost_multiplier = ${
          xp_boost.multiplier ?? reward.multiplier
        }, xp_boost_duration = ${
          xp_boost.duration ?? reward.duration
        }, currency_to_give = ${
          currency.name ?? reward.currency_to_give
        }, currency_to_give_amount = ${
          currency.amount ?? reward.currency_to_give_amount
        }, role_id = ${role_id ?? reward.role_id} WHERE messages = ${messages}`
      );
    }
    interaction.editReply(
      "Success! It'll take up to a minute for this to take effect."
    );
  },
  options: {
    server_cooldown: 0,
  },
};
