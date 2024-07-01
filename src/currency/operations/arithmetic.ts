import SQL from "sql-template-strings";
import { db } from "../../startup/db.js";
import { does_currency_exist } from "./does_currency_exist.js";
import { get_currency_config } from "../configurers/currencies.js";
import * as Discord from "discord.js";
import * as levelups from "../../currency/operations/levelups.js";
import { client } from "../../startup/client.js";
import config from "../../configs/config.json" assert { type: "json" };
import {
  extend_xp_boost,
  generate_xp_boost,
} from "../configurers/xp_boosts.js";
import { random_embed_color } from "../../util/random_embed_color.js";
const reward_boosters = config.server.roles.reward_boosters;

export async function add_currency(
  user_id: string,
  currency_name: string,
  amount: number,
  reason?: string
): Promise<void> {
  const user_currency_amount = await get_currency_balance(
    user_id,
    currency_name
  );
  const new_amount = user_currency_amount + amount;
  if (
    new_amount < 0 &&
    !(await get_currency_config(currency_name)).can_be_negative
  )
    throw new Error("This currency cannot be negative");
  await db.run(
    SQL`UPDATE user_currencies SET amount = ${
      user_currency_amount + amount
    } WHERE user_id = ${user_id} AND currency_id = ${currency_name}`
  );
  if (reason) {
    const econlogs = client.channels.resolve(
      config.server.channels.econlogs
    ) as Discord.TextChannel;
    econlogs.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(random_embed_color())
          .setTitle(
            `${amount} ${currency_name} added to ${
              client.users.resolve(user_id).displayName
            }`
          )
          .setDescription(
            `${reason ? `Reason: ${reason}` : `No reason specified`}`
          ),
      ],
    });
  }
}

export async function get_currency_balance(
  user_id: string,
  currency_id?: string
): Promise<any> {
  if (currency_id) {
    if (!(await does_currency_exist(currency_id)))
      throw new Error("Currency does not exist");
    const data = await db.get(
      SQL`SELECT currency_id, amount FROM user_currencies WHERE user_id = ${user_id} AND currency_id = ${currency_id}`
    );
    if (data == undefined) {
      await db.run(
        SQL`INSERT INTO user_currencies (user_id, currency_id, amount) VALUES (${user_id}, ${currency_id}, 0)`
      );
      return 0;
    }
    return data.amount;
  } else {
    const data =
      (await db.all(
        SQL`SELECT currency_id, amount FROM user_currencies WHERE user_id = ${user_id}`
      )) || [];
    let user_currency_amounts = {};
    for (let row of data) user_currency_amounts[row.currency_id] = row.amount;
    // Fill in data for any currency data the user is missing
    let currency_row = await db.get(
      `SELECT group_concat(currency_id) AS list FROM currency_config`
    );
    const currency_list = currency_row.list;
    for (let currency of currency_list.split(",")) {
      if (!user_currency_amounts[currency]) user_currency_amounts[currency] = 0;
    }
    return user_currency_amounts;
  }
}

export async function reset_currency(currency_name: string): Promise<void> {
  if (!(await does_currency_exist(currency_name)))
    throw new Error("Currency does not exist");
  await db.run(
    SQL`UPDATE user_currencies SET amount = 0 WHERE currency_id = ${currency_name}`
  );
}

export async function autogive_message(user_id: string): Promise<void> {
  // Query currency_config for all currencies with message_auto_give != undefined
  const currencies = await db.all(
    `SELECT * FROM currency_config WHERE message_auto_give IS NOT NULL`
  );
  for (let currency of currencies)
    await add_currency(
      user_id,
      currency.currency_id,
      currency.message_auto_give
    );
}

export async function add_user_xp(
  user_id: string,
  amount_to_add: number,
  levelup_channel: Discord.TextBasedChannel
) {
  const balances = await get_currency_balance(user_id);
  const new_xp = balances.xp + amount_to_add;
  await add_currency(user_id, "xp", amount_to_add);
  if (
    levelups.first_message.checker(
      balances.xp,
      balances.prestige,
      balances.superprestige
    )
  ) {
    levelups.first_message.process(user_id, levelup_channel);
  }
  if (levelups.xp_system.checker(balances.xp, new_xp))
    await levelups.xp_system.process(new_xp, user_id, levelup_channel);
}

export async function purge_member_currencies(user_id: string): Promise<void> {
  await db.all(SQL`DELETE FROM user_currencies WHERE user_id = ${user_id}`);
  await db.all(SQL`DELETE FROM xp_boosts WHERE owner_id = ${user_id}`);
  return;
}

export async function get_user_xp_multiplier(
  user_id: string,
  channel_id?: string
) {
  const user_boosts = await db.all(
    SQL`SELECT multiplier FROM xp_boosts WHERE owner_id = ${user_id} AND end_timestamp > ${Date.now()}`
  );
  if (!user_boosts[0]) return 1;
  const user_boost_multipliers = user_boosts.map((boost) => boost.multiplier);
  let user_boost_total = user_boost_multipliers.reduce(
    (total, boost) => total * boost
  );
  if (channel_id) {
    if (
      config.server.leveling.modified_xp_channels
        .map(([id]) => id)
        .includes(channel_id)
    )
      user_boost_total *= config.server.leveling.modified_xp_channels.find(
        ([id]) => id === channel_id
      )[1] as number;
  }
  const user_boosting = client.guilds
    .resolve(config.server.id)
    .members.resolve(user_id).premiumSince
    ? true
    : false;
  let max_user_boost_total =
    config.server.leveling.max_xp_boost_multipliers.default;
  if (user_boosting)
    max_user_boost_total =
      config.server.leveling.max_xp_boost_multipliers.boosters;
  return Math.min(user_boost_total, max_user_boost_total);
}

export async function give_reward(user_id: string, messages: number) {
  // Get reward & member
  const {
    xp_boost_multiplier,
    xp_boost_duration,
    currency_to_give,
    currency_to_give_amount,
    role_id,
  } = await db.get(SQL`SELECT * from rewards WHERE messages = ${messages}`);
  const guild = client.guilds.resolve(config.server.id);
  const member = guild.members.resolve(user_id);

  // Calculate reward multiplier
  let reward_multiplier = 1;
  for (let [id, badge_multiplier] of Object.entries(reward_boosters)) {
    if (member.roles.cache.has(id) && badge_multiplier > reward_multiplier)
      reward_multiplier = badge_multiplier;
  }

  // Dispense reward
  if (currency_to_give && currency_to_give_amount)
    await add_currency(
      user_id,
      currency_to_give,
      Math.round(currency_to_give_amount)
    );
  if (role_id) member.roles.add(role_id);
  if (xp_boost_duration && xp_boost_multiplier) {
    const boost_to_extend = await db.get(
      SQL`SELECT * from xp_boosts WHERE multiplier = ${xp_boost_multiplier} AND owner_id = ${user_id}`
    );
    if (boost_to_extend)
      extend_xp_boost({
        id: boost_to_extend.id,
        extend_ms: xp_boost_duration * reward_multiplier,
      });
    else
      generate_xp_boost({
        owner_id: user_id,
        multiplier: xp_boost_multiplier,
        unclaimed_time_ms: Math.round(xp_boost_duration * reward_multiplier),
      });
  }
}
