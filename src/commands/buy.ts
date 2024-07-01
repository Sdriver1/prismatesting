import * as Discord from "discord.js";
import { buy_item } from "../command_parts/buy_item.js";

export default {
  data: new Discord.SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy an item")
    .addStringOption((option) =>
      option
        .setName("item_name")
        .setDescription("The item you want to buy")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("gift_to")
        .setDescription("The user you want to gift the item to")
    )
    .addBooleanOption((option) =>
      option
        .setName("gift_anonymously")
        .setDescription(
          "Whether or not you want the recipient to know who sent this"
        )
    )
    .addStringOption((option) =>
      option
        .setName("gift_message")
        .setDescription("The message the bot should pass along with your gift")
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    try {
      await buy_item({
        buyer: interaction.user,
        item_name: interaction.options.getString("item_name"),
        gift_anonymously: interaction.options.getBoolean("gift_anonymously"),
        gift_receiver: interaction.options.getUser("gift_to"),
        gift_message: interaction.options.getString("gift_message"),
      });
    } catch (err) {
      interaction.editReply({ content: `${err.message}` });
      return;
    }
    interaction.editReply(
      `# Purchase successful!\n▸ Thanks for shopping with Prismatic :)\n> ▸ Not like we have any competition!`
    );
  },
  options: {
    server_cooldown: 0,
  },
};
