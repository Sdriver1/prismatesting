import * as Discord from "discord.js";
import { get_store_item } from "../currency/operations/storeitems.js";
import { configure_store_item } from "../currency/configurers/storeitems.js";
import { does_currency_exist } from "../currency/operations/does_currency_exist.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("editstoreitem")
    .setDescription("Edit an item in any currency's store")
    .addStringOption((option) =>
      option
        .setName("item_name")
        .setDescription("The name of the item you want to edit")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("currency_required")
        .setDescription("The currency used to buy this item")
    )
    .addNumberOption((option) =>
      option
        .setName("price")
        .setDescription("The amount, in currency, the item costs")
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The item's description shown in /shop")
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
          "The currency the user should get when tehy buy this item"
        )
    )
    .addNumberOption((option) =>
      option
        .setName("currency_to_give_amount")
        .setDescription(
          "The amount of currency the user should get when they buy this item"
        )
    ),
  run: async function (interaction) {
    // Get options
    const item_name = interaction.options.getString("item_name");
    const existing_store_item_config = await get_store_item(item_name);

    const currency_required =
      interaction.options.getString("currency_required") ||
      existing_store_item_config.currency_required;
    const price =
      interaction.options.getNumber("price") ||
      existing_store_item_config.price;
    const description =
      interaction.options.getString("description") ||
      existing_store_item_config.description;
    const role_to_give =
      interaction.options.getRole("role_to_give") ||
      existing_store_item_config.role_to_give;
    const role_duration =
      interaction.options.getNumber("role_duration") ||
      existing_store_item_config.role_duration;
    const currency_to_give =
      interaction.options.getString("currency_to_give") ||
      existing_store_item_config.currency_to_give;
    const currency_to_give_amount =
      interaction.options.getNumber("currency_to_give_amount") ||
      existing_store_item_config.currency_to_give_amount;
    if (item_name && !get_store_item(item_name)) {
      interaction.editReply({
        content: `Hey! Give me a real item! (  •̀ ᴖ •́  )`,
      });
      return;
    }
    if (currency_required && !(await does_currency_exist(currency_required))) {
      interaction.editReply({
        content: `Hey! Give me a real currency! (  •̀ ᴖ •́  )`,
      });
      return;
    }
    // Configure store item
    let role_to_give_id = role_to_give ? role_to_give.id : undefined;
    try {
      await configure_store_item({
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
        content: `Successfully configured store item \`${item_name}\``,
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
