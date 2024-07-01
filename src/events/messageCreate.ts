import * as Discord from "discord.js";
import {
  autogive_message,
  get_currency_balance,
} from "../currency/operations/arithmetic.js";
import * as levelups from "../currency/operations/levelups.js";
import {
  add_user_xp,
  get_user_xp_multiplier,
} from "../currency/operations/arithmetic.js";
import { minigames } from "../util/minigames.js";
import config from "../configs/config.json" assert { type: "json" };
import { chance } from "../util/chance.js";

let minigame_cooldown = false;
let xp_cooldown = [];
export async function messageCreate(message: Discord.Message) {
  if (!message.author.bot && !message.system) {
    give_user_currencies(message);
    if (message.channel.id === config.server.channels.chat)
      run_minigame_chance(message);
  }
}

async function give_user_currencies(message) {
  await autogive_message(message.author.id);
  const user_currencies = await get_currency_balance(message.author.id);
  if (levelups.monthly_rewards.checker(user_currencies["monthlymessages"]))
    await levelups.monthly_rewards.process(
      user_currencies["monthlymessages"],
      message
    );

  // Special behavior for XP
  if (xp_cooldown.includes(message.author.id)) return;

  let amount_to_add =
    10 * (await get_user_xp_multiplier(message.author.id, message.channel.id));
  await add_user_xp(message.author.id, amount_to_add, message.channel);
  xp_cooldown.push(message.author.id);
  setTimeout(
    () => xp_cooldown.splice(xp_cooldown.indexOf(message.author.id, 1)),
    30 * 1000
  );
}

function run_minigame_chance(message) {
  let probability = config.server.minigames.probability_per_message;
  if (!minigame_cooldown && chance(probability)) {
    let minigame =
      minigames[
        Object.keys(minigames)[
          Math.floor(Math.random() * Object.keys(minigames).length)
        ]
      ];
    minigame(message);
    minigame_cooldown = true;
    setTimeout(
      () => (minigame_cooldown = false),
      config.server.minigames.cooldown_ms
    );
  }
  return;
}
