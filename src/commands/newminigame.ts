import * as Discord from "discord.js";
import { does_currency_exist } from "../currency/operations/does_currency_exist.js";
import { run_minigame } from "../util/minigames.js";
import config from "../configs/config.json" assert { type: "json" };
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("newminigame")
    .setDescription("Summon a custom minigame")
    .addStringOption((option) =>
      option
        .setName("instructions")
        .setDescription("The instructions for the minigame")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("clue")
        .setDescription("The clue for the minigame")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("answer")
        .setDescription("The correct answer")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("prize_currency_id")
        .setDescription("The currency ID of the prize")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("prize_amount_min")
        .setDescription("The minimum amount of the prize currency")
    )
    .addNumberOption((option) =>
      option
        .setName("prize_amount_max")
        .setDescription("The maximum amount of the prize currency")
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    const prize_data = {
      prize_currency_id: interaction.options.getString("prize_currency_id"),
      prize_amount_min:
        interaction.options.getNumber("prize_amount_min") ??
        config.server.minigames.default_prize_data.prize_amount_min,
      prize_amount_max:
        interaction.options.getNumber("prize_amount_max") ??
        config.server.minigames.default_prize_data.prize_amount_max,
    };
    if (!(await does_currency_exist(prize_data.prize_currency_id)))
      interaction.editReply({
        content: `This currency does not exist!`,
      });
    if (prize_data.prize_amount_max < prize_data.prize_amount_min)
      interaction.editReply({
        content: `I don't think your minimum prize amount is supposed to be higher than your maximum prize amount there, buddy. Try again`,
      });
    const minigame_data = {
      instructions: interaction.options.getString("instructions"),
      clue: interaction.options.getString("clue"),
      correct_answers: [interaction.options.getString("answer")],
    };
    run_minigame(
      interaction.channel as Discord.TextChannel,
      minigame_data,
      prize_data
    );
    interaction.editReply({ content: "Success" });
  },
  options: {
    server_cooldown: 0,
  },
};
