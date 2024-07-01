import config from "../configs/config.json" assert { type: "json" };
import * as Discord from "discord.js";
import { add_currency } from "../currency/operations/arithmetic.js";
import { random_from_array } from "./random_from_array.js";
import { random_string } from "./random_string.js";

export interface MinigameData {
  instructions: string;
  clue: string;
  correct_answers: any[];
}
export interface MinigamePrizeData {
  prize_currency_id: string;
  prize_amount_min: number;
  prize_amount_max: number;
}
export async function run_minigame(
  channel: Discord.TextChannel,
  minigame_info: MinigameData,
  prize_info: MinigamePrizeData
): Promise<void> {
  let minigame_message;
  try {
    minigame_message = await channel.send({
      content: `# 🎮 A wild minigame appears!\n▸ ${minigame_info.instructions}\n▸ \`${minigame_info.clue}\``,
    });
  } catch (err) {
    throw new Error(
      "The bot does not have access to the channel you attempted to start the minigame in"
    );
  }
  const filter = (message: Discord.Message) =>
    minigame_info.correct_answers.includes(message.content) &&
    !message.author.bot;
  channel
    .awaitMessages({
      filter,
      max: 1,
      time: 60 * 1000,
      errors: ["time"],
    })
    .then((collected_messages) => {
      const winner = collected_messages.first().member;
      const prize_amount = Math.floor(
        Math.random() *
          (prize_info.prize_amount_max - prize_info.prize_amount_min + 1) +
          prize_info.prize_amount_min
      );
      minigame_message.edit({
        content:
          minigame_message.content +
          `\n\n**GG!** Solved by <@${winner.id}>\n> +**${prize_amount}** ${prize_info.prize_currency_id}!`,
      });
      try {
        add_currency(
          winner.id,
          prize_info.prize_currency_id,
          prize_amount,
          "Minigame completed"
        );
      } catch (err) {
        minigame_message.edit({
          content:
            minigame_message.content +
            ` (Error during payout; contact Moderation)`,
        });
      }
    })
    .catch(() =>
      minigame_message.edit({
        content: `~~${minigame_message.content}~~\n\nThis minigame has expired; nobody won.`,
      })
    );
}

export const minigames = {
  guess_the_emoji: function (message: Discord.Message) {
    const [clues, emojis] = random_from_array(
      config.server.minigames.guess_the_emoji_clues
    );
    const selected_clue = random_from_array(clues);
    run_minigame(
      message.channel as Discord.TextChannel,
      {
        instructions: `Send the **emoji** corresponding to the clue.`,
        clue: selected_clue,
        correct_answers: emojis,
      },
      config.server.minigames.default_prize_data
    );
  },
  sum: function (message: Discord.Message) {
    const min_number_amount =
      config.server.minigames.sum_of_numbers.number_of_values.min;
    const max_number_amount =
      config.server.minigames.sum_of_numbers.number_of_values.max;
    const min_number_value =
      config.server.minigames.sum_of_numbers.value_limits.min;
    const max_number_value =
      config.server.minigames.sum_of_numbers.value_limits.max;
    const number_amount = Math.floor(
      Math.random() * (max_number_amount - min_number_amount + 1) +
        min_number_amount
    );
    let numbers = [];
    for (let i = 0; i < number_amount; i++) {
      numbers.push(
        Math.floor(
          Math.random() * (max_number_value - min_number_value + 1) +
            min_number_value
        )
      );
    }
    run_minigame(
      message.channel as Discord.TextChannel,
      {
        instructions: "Send the **sum of these numbers**.",
        clue: numbers.join(" + "),
        correct_answers: [
          `${numbers.reduce((accumulator, n) => accumulator + n)}`,
        ],
      },
      config.server.minigames.default_prize_data
    );
  },
  how_long: function (message: Discord.Message) {
    const string = random_string(
      Math.floor(Math.random() * (25 - 10 + 1) + 10)
    );
    run_minigame(
      message.channel as Discord.TextChannel,
      {
        instructions: `Send the **number of characters** in this string.`,
        clue: string,
        correct_answers: [`${string.length}`],
      },
      config.server.minigames.default_prize_data
    );
  },
  copy_paste: function (message: Discord.Message) {
    const string = random_string(
      Math.floor(Math.random() * (25 - 10 + 1) + 10)
    );
    run_minigame(
      message.channel as Discord.TextChannel,
      {
        instructions: `**Resend** this message (do not copy paste).`,
        // Add zero width whitespace between every character
        clue: string.split("").join("​"),
        correct_answers: [string],
      },
      config.server.minigames.default_prize_data
    );
  },
};
