import * as Discord from "discord.js";
import { delete_currency } from "../currency/configurers/currencies.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("deletecurrency")
    .setDescription("Delete a currency. Cannot be undone.")
    .addStringOption((option) =>
      option
        .setName("currency")
        .setDescription("The currency to delete")
        .setRequired(true)
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    const currency_name = interaction.options.getString("currency");
    try {
      await delete_currency(currency_name);
      interaction.editReply({
        content: `Successfully deleted currency \`${currency_name}\` and all associated store items (if any).`,
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
