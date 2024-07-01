import * as Discord from "discord.js";
import {
  add_currency,
  get_currency_balance,
} from "../currency/operations/arithmetic.js";
import { get_currency_config } from "../currency/configurers/currencies.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("transfer")
    .setDescription("Give currency to another user from your own balance")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to transfer the currency to")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("currency")
        .setDescription("The currency to transfer")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount to give. Must be a positive integer.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("private")
        .setDescription(
          "Whether to hide the chat message I will send showing this transfer happened"
        )
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    // Get options
    const target = interaction.options.getUser("target");
    const currency = interaction.options.getString("currency");
    const amount =
      interaction.options.getNumber("amount") ||
      (await get_currency_balance(interaction.user.id, currency));
    const hide_transfer = interaction.options.getBoolean("private");
    const balance = await get_currency_balance(interaction.user.id, currency);
    if (!Number.isInteger(amount) || Number.isNaN(amount)) {
      interaction.editReply(
        "Hey! Use a valid amount of currency (no decimals or non-numbers)! (  •̀ ᴖ •́  )"
      );
      return;
    }
    if (target.bot) {
      interaction.editReply(
        "Hey! Stop trying to add currency to bots! (  •̀ ᴖ •́  )"
      );
      return;
    }
    // Make sure the user has enough money to do this
    try {
      if (balance < amount) {
        interaction.editReply({
          content: `You don't have enough ${currency} to do this!`,
        });
        return;
      }
    } catch (err) {
      interaction.editReply({
        content: `An error occured while checking your balance of ${currency}: ${err}`,
      });
      return;
    }
    // Make sure the user isn't transferring negative money
    if (amount <= 0) {
      interaction.editReply({
        content: `Hey! Stop trying to transfer people negative money! That's rude! (  •̀ ᴖ •́  )`,
      });
      return;
    }
    // Make sure the currency is transferrable
    try {
      const config = await get_currency_config(currency);
      if (!config.transferrable) {
        interaction.editReply({
          content: `You can't transfer ${currency}!`,
        });
        return;
      }
    } catch (err) {
      interaction.editReply({
        content: `An error occured while checking if ${currency} is transferrable: ${err}`,
      });
      return;
    }
    // Add currency to user
    try {
      await add_currency(
        interaction.user.id,
        currency,
        -amount,
        "User transfer"
      );
      await add_currency(target.id, currency, amount, "User transfer");
      interaction.editReply({
        content: `Successfully transferred ${amount} ${currency} to ${target.username}`,
      });
      if (!hide_transfer) {
        let transfer_message = `:money_with_wings: <@${interaction.user.id}> transferred **${amount}** ${currency} to <@${target.id}>!`;
        if (target.id === interaction.user.id)
          transfer_message += " What was the point of that, though?";
        interaction.channel.send({
          content: transfer_message,
        });
      }
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
