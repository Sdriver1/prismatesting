import * as Discord from "discord.js";
import { edit_xp_boost } from "../currency/configurers/xp_boosts.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("editboost")
    .setDescription(
      "Configure a currency's transferrable, auto give, & negative settings"
    )
    .addStringOption((option) =>
      option
        .setName("boost_id")
        .setDescription("The ID of the boost you want to edit")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("new_owner")
        .setDescription("The new boost owner (takes boost from existing owner)")
    )
    .addNumberOption((option) =>
      option
        .setName("new_duration")
        .setDescription(
          "The new duration in minutes (overrides existing duration)"
        )
    )
    .addNumberOption((option) =>
      option.setName("new_multiplier").setDescription("The new multiplier")
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    // Get options
    const boost_id = interaction.options.getString("boost_id");
    let new_owner = interaction.options.getUser("new_owner")
      ? interaction.options.getUser("new_owner").id
      : undefined;
    let new_duration = interaction.options.getNumber("new_duration");
    const new_multiplier = interaction.options.getNumber("new_multiplier");
    // Configure currency
    try {
      await edit_xp_boost({
        id: boost_id,
        owner_id: new_owner,
        unclaimed_time_ms: new_duration * 60 * 1000,
        multiplier: new_multiplier,
      });
      interaction.editReply({
        content: `Successfully edited boost \`${boost_id}\`.`,
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
