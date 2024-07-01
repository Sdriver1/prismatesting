import * as Discord from "discord.js";
import { get_currency_store } from "../currency/operations/storeitems.js";
import { StoreItemData } from "../currency/configurers/storeitems.js";
import { does_currency_exist } from "../currency/operations/does_currency_exist.js";
import { get_currency_balance } from "../currency/operations/arithmetic.js";
import { number_format_commas } from "../util/number_format_commas.js";
import { buy_item } from "../command_parts/buy_item.js";

export default {
  data: new Discord.SlashCommandBuilder()
    .setName("shop")
    .setDescription("Open a currency's shop")
    .addStringOption((option) =>
      option
        .setName("currency")
        .setDescription("The currency to open the shop for")
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    // Get options
    const currency = interaction.options.getString("currency") || "gold";
    if (!(await does_currency_exist(currency))) {
      interaction.editReply({
        content: `Hey! Give me a real currency! (  •̀ ᴖ •́  )`,
      });
      return;
    }
    const store_data = await get_currency_store(currency);
    let user_currency_balance = await get_currency_balance(
      interaction.user.id,
      currency
    );

    const member = interaction.member as Discord.GuildMember;
    const filtered_store_data = checking_affordable_items(
      store_data,
      user_currency_balance,
      member.roles.cache.map((role) => role.id)
    );

    let reply = await interaction.editReply(
      generate_store_message(filtered_store_data, user_currency_balance)
    );

    const collector = await reply.createMessageComponentCollector({
      time: 5 * 60 * 1000,
    });

    collector.on("collect", async (i) => {
      if (!i.isStringSelectMenu()) return;
      try {
        await buy_item({
          buyer: i.user,
          item_name: i.values[0],
        });
        user_currency_balance = await get_currency_balance(
          interaction.user.id,
          currency
        );

        const updated_filtered_store_data = checking_affordable_items(
          store_data,
          user_currency_balance,
          member.roles.cache.map((role) => role.id)
        );

        await interaction.editReply(
          generate_store_message(
            updated_filtered_store_data,
            user_currency_balance
          )
        );

        i.reply({
          content: `# Purchase successful!\n▸ Thanks for shopping with Prismatic :)\n> ▸ Not like we have any competition!`,
          ephemeral: true,
        });
      } catch (err) {
        i.reply({ content: err.message, ephemeral: true });
      }
    });

    collector.on("end", (collected) => {
      interaction.editReply({ components: [] });
    });
  },
  options: {
    server_cooldown: 0,
  },
};

function generate_store_message(
  store_data: StoreItemData[],
  balance: number
): Discord.InteractionEditReplyOptions {
  if (!store_data[0])
    return { content: "There are no items being sold for this currency!" };
  let store_message = "# Shop\n\n";
  let affordable_items = store_data
    .filter((item) => balance >= item.price)
    .map((item) => item.item_name);
  store_message += store_data
    .map((item) => generate_store_entry(item))
    .join("\n");
  store_message += `\nYou have **${number_format_commas(balance)}** ${
    store_data[0].currency_required
  }`;
  store_message +=
    "\nBuy items with `/buy`! Item names are spacing- and case-sensitive.";

  let quick_buy_row;
  if (affordable_items[0])
    quick_buy_row = generate_quick_buy_row(affordable_items);
  if (quick_buy_row)
    return { content: store_message, components: [quick_buy_row] };
  return { content: store_message, components: [] };
}

function generate_store_entry(store_item: StoreItemData): string {
  return `## ${store_item.item_name}
▸ ${number_format_commas(store_item.price)} ${store_item.currency_required}
▸ ${store_item.description}\n`;
}

function generate_quick_buy_row(
  affordable_items: string[]
): Discord.ActionRowBuilder {
  let quick_buy_row = new Discord.StringSelectMenuBuilder()
    .setCustomId("quick_buy_row")
    .setPlaceholder("Buy an item...")
    .addOptions(
      affordable_items.map((item_name) => ({
        label: item_name,
        value: item_name,
      }))
    );
  return new Discord.ActionRowBuilder().addComponents(quick_buy_row);
}

function checking_affordable_items(
  store_data: StoreItemData[],
  balance: number,
  userRoles: string[]
): StoreItemData[] {
  return store_data.filter(
    (item) =>
      balance >= item.price &&
      (!item.role_to_give_id || !userRoles.includes(item.role_to_give_id))
  );
}
