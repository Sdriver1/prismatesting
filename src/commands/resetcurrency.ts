import * as Discord from "discord.js";
import { reset_currency } from "../currency/operations/arithmetic.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("resetcurrency")
    .setDescription("Set everyone's balance of a currency to 0")
    .addStringOption((option) =>
      option
        .setName("currency")
        .setDescription("The currency you wish to reset")
        .setRequired(true)
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    const currency = interaction.options.getString("currency");
    try {
      await reset_currency(currency);
      interaction.editReply({
        content: `Successfully reset everyone's balance of ${currency} to 0`,
      });
    } catch (err) {
      interaction.editReply({
        content: `${err}`,
      });
    }
  },
  options: {
    server_cooldown: 0,
  },
};
