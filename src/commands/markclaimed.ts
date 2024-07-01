import * as Discord from "discord.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("markclaimed")
    .setDescription("Mark a reward message as claimed")
    .addStringOption((option) =>
      option
        .setName("message_id")
        .setDescription("The ID of the reward message")
        .setRequired(true)
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    // Get options
    const message_id = interaction.options.getString("message_id");
    const message = await interaction.channel.messages
      .fetch(message_id)
      .catch((err) => {
        interaction.editReply(
          "Message not found! Make sure you're in the same channel as the message."
        );
        return;
      });
    if (!message) return;
    if (message.author.id !== interaction.client.user.id) {
      interaction.editReply("I cannot edit this message!");
      return;
    }
    const new_message_content =
      message.content + "\n\nA moderator has claimed this for you.";
    if (new_message_content.length > 2000) {
      interaction.editReply(
        "I'm interested in the fact that you test for edge cases like this. Nice try, but no."
      );
      return;
    } else {
      message.edit({
        content: new_message_content,
        components: [],
      });
      interaction.editReply("Done!");
    }
  },
  options: {
    server_cooldown: 0,
  },
};
