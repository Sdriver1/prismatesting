import * as Discord from "discord.js";
import { add_currency } from "../currency/operations/arithmetic.js";
import { client } from "../startup/client.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("addcurrency")
    .setDescription("Generate currency & credit it to user")
    .addStringOption((option) =>
      option
        .setName("currency")
        .setDescription("The currency to modify.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription(
          "The amount of currency to add. Specify a negative number to remove currency."
        )
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("target_user")
        .setDescription("The user whose currency to modify")
    )
    .addRoleOption((option) =>
      option
        .setName("target_role")
        .setDescription(
          "The role whose members will each get the full amount specified in this command"
        )
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason you are adding the currency")
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    // Get options
    const target_user = interaction.options.getUser("target_user");
    const target_role = interaction.options.getRole("target_role");
    const currency = interaction.options.getString("currency");
    const amount = interaction.options.getNumber("amount");
    const reason = interaction.options.getString("reason");
    if (!target_role && !target_user) {
      interaction.editReply(
        "At this time, you can only add to a user OR a role, not both."
      );
      return;
    }
    // Add currency to user
    if (target_user) {
      if (target_user.bot) {
        interaction.editReply(
          "Hey! Stop trying to add currency to bots! (  •̀ ᴖ •́  )"
        );
        return;
      }
      try {
        await add_currency(
          target_user.id,
          currency,
          amount,
          `Mod action by ${interaction.user.displayName} ${
            reason ? `for reason \`${reason}\`` : `with no reason spcified`
          }`
        );
        interaction.editReply({
          content: `Successfully added ${amount} ${currency} to ${target_user.displayName}'s balance`,
        });
      } catch (err) {
        interaction.editReply({
          content: `${err}`,
        });
      }
    }
    if (target_role) {
      const guild = client.guilds.resolve(interaction.guild);
      const fetched_guild_members = await (await guild.fetch()).members.fetch();
      for (let [id, member] of fetched_guild_members) {
        if (member.roles.cache.has(target_role.id)) {
          await add_currency(
            id,
            currency,
            amount,
            `Mod action by ${interaction.user.displayName} ${
              reason ? `for reason \`${reason}\`` : `with no reason specified`
            }`
          );
        }
      }
      interaction.editReply({
        content: `Successfully added ${amount} ${currency} to everyone with ${target_role}.`,
      });
    }
    if (!target_role && !target_user)
      interaction.editReply(
        "### Fun Cringelord Facts!\n▸ You're supposed to specify either `target_role` or `target_user`"
      );
  },
  options: {
    server_cooldown: 0,
  },
};
