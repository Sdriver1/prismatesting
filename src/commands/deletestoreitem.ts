import * as Discord from "discord.js";
import { delete_store_item } from "../currency/configurers/storeitems.js";
// Delete store item
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("deletestoreitem")
    .setDescription("Delete an item from any currency's store")
    .addStringOption((option) =>
      option
        .setName("item_name")
        .setDescription("The name of the item you want to delete")
        .setRequired(true)
    ),
  run: async function (interaction) {
    const item_name = interaction.options.getString("item_name");
    try {
      delete_store_item(item_name);
      interaction.editReply({
        content: `Successfully deleted item \`${item_name}\``,
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
