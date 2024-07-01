import * as Discord from "discord.js";
import { configure_currency } from "../currency/configurers/currencies.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("editcurrency")
    .setDescription(
      "Configure a currency's transferrable, auto give, & negative settings"
    )
    .addStringOption((option) =>
      option
        .setName("currency_name")
        .setDescription("The currency you want to edit")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("transferrable")
        .setDescription("Allow users to /transfercurrency their balance")
    )
    .addNumberOption((option) =>
      option
        .setName("auto_give_message")
        .setDescription("The amount to give automatically per message")
    )
    .addNumberOption((option) =>
      option
        .setName("auto_give_boost")
        .setDescription("The amount to give automatically per boost")
    )
    .addBooleanOption((option) =>
      option
        .setName("can_be_negative")
        .setDescription(
          "Allow users to hold a negative balance of this currency"
        )
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    // Get options
    const currency_name = interaction.options.getString("currency_name");
    const transferrable = interaction.options.getBoolean("transferrable");
    const message_auto_give =
      interaction.options.getNumber("auto_give_message");
    const boost_auto_give = interaction.options.getNumber("auto_give_boost");
    const can_be_negative = interaction.options.getBoolean("can_be_negative");
    // Configure currency
    try {
      await configure_currency(
        currency_name,
        transferrable,
        message_auto_give,
        boost_auto_give,
        can_be_negative
      );
      interaction.editReply({
        content: `Successfully configured currency \`${currency_name}\``,
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
