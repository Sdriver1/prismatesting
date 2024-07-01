import * as Discord from "discord.js";
import { get_currency_balance } from "../currency/operations/arithmetic.js";
import { number_format_commas } from "../util/number_format_commas.js";
export default {
  data: new Discord.ContextMenuCommandBuilder()
    .setName("Get Balance")
    .setType(Discord.ApplicationCommandType.User),
  run: async function (interaction: Discord.UserContextMenuCommandInteraction) {
    const target = interaction.targetUser;
    if (target.bot) {
      interaction.editReply(
        "Hey! Bots aren't allowed to have currency! (  •̀ ᴖ •́  )"
      );
      return;
    }
    const currency_balances = await get_currency_balance(target.id);
    let output_message = `### ${target.displayName}\n`;
    for (let currency in currency_balances) {
      // \n is on the left side so the last currency line doesn't leave an extra newline
      output_message += `\n▸ **${number_format_commas(
        currency_balances[currency]
      )}** ${currency}`;
    }
    interaction.editReply(output_message);
  },
  options: {
    server_cooldown: 0,
  },
};
