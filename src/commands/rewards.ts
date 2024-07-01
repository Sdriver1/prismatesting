import * as Discord from "discord.js";
import { get_currency_balance } from "../currency/operations/arithmetic.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("rewardprogress")
    .setDescription("See your progress on #get-started -> rewards")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user whose progress to check")
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    const target = interaction.options.getUser("target") || interaction.user;
    const message_count = await get_currency_balance(
      target.id,
      "monthlymessages"
    );
    interaction.editReply({
      content: `### ${target.displayName}'s Progress\n▸ Messages: **${message_count}**\n▸ **[Reward list available here.](<https://discord.com/channels/921403338069770280/1191404399608725555/1191404404369272842>)**`,
    });
  },
  options: {
    server_cooldown: 0,
  },
};
