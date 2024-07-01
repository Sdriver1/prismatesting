import * as Discord from "discord.js";
import { get_currency_balance } from "../currency/operations/arithmetic.js";
import { number_format_commas } from "../util/number_format_commas.js";
import { random_embed_color } from "../util/random_embed_color.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your/someone's balance of a currency")
    .addUserOption((option) =>
      option.setName("target").setDescription("The user whose balance to check")
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    const target = interaction.options.getUser("target") || interaction.user;
    if (target.bot) {
      interaction.editReply(
        "Hey! Bots aren't allowed to have currency! (  •̀ ᴖ •́  )"
      );
      return;
    }
    const currency_balances = await get_currency_balance(target.id);
    let balance_list = "";
    for (let currency in currency_balances) {
      // \n is on the left side so the last currency line doesn't leave an extra newline
      balance_list += `\n▸ **${number_format_commas(
        currency_balances[currency]
      )}** ${currency}`;
    }
    let output_embed = new Discord.EmbedBuilder()
      .setColor(random_embed_color())
      .setTitle(target.displayName)
      .setThumbnail(target.displayAvatarURL())
      .setDescription(balance_list);
    interaction.editReply({ embeds: [output_embed] });
  },
  options: {
    server_cooldown: 0,
  },
};
