import * as Discord from "discord.js";
import { create_store_item } from "../currency/configurers/storeitems.js";
import { does_currency_exist } from "../currency/operations/does_currency_exist.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("newstoreitem")
    .setDescription("Add a new item to any currency's store")
    .addStringOption((option) =>
      option
        .setName("item_name")
        .setDescription("The name of the item you want to add. Must be unique.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("currency_required")
        .setDescription("The currency used to buy this item")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("price")
        .setDescription("The amount, in currency, the item costs")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The item's description shown in /shop")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role_to_give")
        .setDescription(
          "The role (if any) to give to the user when they buy this item"
        )
    )
    .addNumberOption((option) =>
      option
        .setName("role_duration")
        .setDescription(
          "How long (in minutes) the user should keep the role (blank = infinite)"
        )
    )
    .addStringOption((option) =>
      option
        .setName("currency_to_give")
        .setDescription(
          "The currency the user should get when they buy this item"
        )
    )
    .addNumberOption((option) =>
      option
        .setName("currency_to_give_amount")
        .setDescription(
          "The amount of currency the user should get when they buy this item"
        )
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    /// Get every option
    const item_name = interaction.options.getString("item_name");
    const currency_required =
      interaction.options.getString("currency_required");
    const price = interaction.options.getNumber("price");
    const description = interaction.options.getString("description");
    const role_to_give = interaction.options.getRole("role_to_give");
    const role_duration = interaction.options.getNumber("role_duration");
    const currency_to_give = interaction.options.getString("currency_to_give");
    const currency_to_give_amount = interaction.options.getNumber(
      "currency_to_give_amount"
    );
    if (price < 0) {
      interaction.editReply({
        content:
          "Negative prices? Real funny there. How the fuck do you think an interaction like this would go in real life? You go to the grocery store, buy your stuff, and the cashier hands you your shit and $100?!?!? You fucking wish. (  •̀ ᴖ •́  )",
      });
      return;
    }
    if (!(await does_currency_exist(currency_required))) {
      interaction.editReply({
        content:
          "Every day, I get more and more tired of people like you who think it's funny to try to break the bot. How the fuck do you think this interaction would play out? You go to the grocery store, buy your shit, and the cashier tries to charge you 49 Snorgles for your fucking food?!?! It's not so funny when the joke is played on you, is it? Stop trying to make store items that charge currency that doesn't exist. (  •̀ ᴖ •́  )",
      });
      return;
    }
    // Create the store item
    let role_to_give_id = role_to_give ? role_to_give.id : undefined;
    try {
      await create_store_item({
        item_name,
        currency_required,
        price,
        description,
        role_to_give_id,
        role_duration,
        currency_to_give,
        currency_to_give_amount,
      });
      interaction.editReply({
        content: `Successfully created store item \`${item_name}\``,
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
