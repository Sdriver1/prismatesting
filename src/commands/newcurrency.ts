import * as Discord from "discord.js";
import { create_currency } from "../currency/configurers/currencies.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("newcurrency")
    .setDescription("Add a currency to the database")
    .addStringOption((option) =>
      option
        .setName("currency")
        .setDescription("The name of the currency")
        .setRequired(true)
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    const currency_name = interaction.options.getString("currency");
    try {
      await create_currency(currency_name);
      interaction.editReply({
        content: `Successfully created currency \`${currency_name}\``,
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
