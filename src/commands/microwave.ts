import * as Discord from "discord.js";
// Delete store item
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("microwave")
    .setDescription("mmmmmmmmmmmmmmmmm")
    .addStringOption((option) =>
      option.setName("item").setDescription("The thing you want to microwave")
    ),
  run: async function (interaction) {
    const item_name = interaction.options.getString("item");
    const microwave_message = await interaction.editReply("Click");
    await wait(1000);
    microwave_message.edit("Clank");
    await wait(1000);
    microwave_message.edit("m");
    for (let i = 0; i < 10; i++) {
      microwave_message.edit("m" + "m".repeat(i * 2));
      await wait(1000);
    }
    microwave_message.edit("BEEP!");
    await wait(1000);
    microwave_message.edit("### BEEP! x2");
    await wait(1000);
    microwave_message.edit("# BEEP! x3");
    await wait(1000);
    microwave_message.edit("Successful microwave!");
  },
  options: {
    server_cooldown: 0,
  },
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
