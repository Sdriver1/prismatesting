import * as Discord from "discord.js";
import SQL from "sql-template-strings";
import { db } from "../startup/db.js";

export default {
  data: new Discord.SlashCommandBuilder()
    .setName("deletereward")
    .setDescription("Delete a reward (based on monthlymessages)")
    .addNumberOption((option) =>
      option
        .setName("messages")
        .setDescription("The # of messages this reward is given at")
        .setRequired(true)
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    const messages = interaction.options.getNumber("messages");
    await db.all(SQL`DELETE FROM rewards WHERE messages = ${messages}`);
    interaction.editReply("Done!");
  },
  options: {
    server_cooldown: 0,
  },
};
