import * as Discord from "discord.js";
import { db } from "../startup/db.js";
import SQL from "sql-template-strings";
import config from "../configs/config.json" assert { type: "json" };
import { get_user_xp_multiplier } from "../currency/operations/arithmetic.js";
import {
  activate_boost,
  get_available_boosts,
} from "../command_parts/xp_boosts.js";
import { interactionCreate } from "../events/interactionCreate.js";
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("useboost")
    .setDescription("Activate an XP boost available to you")
    .addNumberOption((option) =>
      option
        .setName("id")
        .setDescription("The ID of the boost (see /boosts)")
        .setRequired(false)
    )
    .addNumberOption((option) =>
      option.setName("hours").setDescription("Hours to use the boost for")
    )
    .addNumberOption((option) =>
      option.setName("minutes").setDescription("Minutes to use the boost for")
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    if (!interaction.options.getNumber("id")) {
      interaction.editReply({
        content: `### Use all your boosts
▸ Are you sure you want to use all your boosts for their entire durations?
▸ If you want to use one boost, run this command again but specify one of your boost IDs.`,
        components: [
          new Discord.ActionRowBuilder<Discord.ButtonBuilder>().addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Primary)
              .setLabel("Yes")
              .setCustomId("yes")
          ),
        ],
      });
      (await interaction.fetchReply())
        .awaitMessageComponent({ time: 10 * 60 * 1000 })
        .then(async (i) => {
          let boosts = await get_available_boosts(interaction.user.id);
          for (let boost of boosts) {
            await activate_boost(boost.id, boost.unclaimed_time_ms);
          }
          interaction.editReply({
            content: `### All boosts activated!
▸ Now go rake in that XP! ᕙ(  •̀ ᗜ •́  )ᕗ`,
            components: [],
          });
        })
        .catch((err) => {
          return;
        });
    } else {
      let id = interaction.options.getNumber("id");
      if (!id) {
        interaction.editReply("You must specify a boost ID!");
        return;
      }
      let duration_ms =
        interaction.options.getNumber("hours") * 60 * 60 * 1000 +
        interaction.options.getNumber("minutes") * 60 * 1000;
      if (!Number.isInteger(duration_ms) || Number.isNaN(duration_ms)) {
        interaction.editReply(
          "Hey! Use a valid amount of time (no decimals or non-numbers)! (  •̀ ᴖ •́  )"
        );
        return;
      }
      const user_boosts = await db.all(
        SQL`SELECT * FROM xp_boosts WHERE owner_id = ${interaction.user.id}`
      );
      const selected_boost = user_boosts.find((boost) => boost.id === id);
      if (!selected_boost)
        return interaction.editReply({
          content: "The ID you provided is not a boost you own!",
        });
      if (duration_ms > selected_boost.unclaimed_time_ms)
        return interaction.editReply({
          content: "You don't have that much time left on your boost!",
        });
      if (!duration_ms || duration_ms <= 0)
        duration_ms = selected_boost.unclaimed_time_ms;
      const boost_ms_remaining = selected_boost.unclaimed_time_ms - duration_ms;
      const current_timestamp = Date.now();
      const existing_end_timestamp = selected_boost.end_timestamp;
      const new_end_timestamp =
        Math.max(existing_end_timestamp || 0, current_timestamp) + duration_ms;
      const user_boost_multiplier = await get_user_xp_multiplier(
        interaction.user.id
      );
      const new_user_boost_mutliplier =
        user_boost_multiplier * selected_boost.multiplier;
      const max_boost_mutliplier = (interaction.member as Discord.GuildMember)
        .premiumSince
        ? config.server.leveling.max_xp_boost_multipliers.boosters
        : config.server.leveling.max_xp_boost_multipliers.default;
      if (new_user_boost_mutliplier <= max_boost_mutliplier) {
        await db.all(
          SQL`UPDATE xp_boosts SET unclaimed_time_ms = ${boost_ms_remaining}, end_timestamp = ${new_end_timestamp} WHERE id = ${id}`
        );
        interaction.editReply({
          content: redemption_success_message(new_end_timestamp),
        });
      } else {
        const reply = await interaction.editReply({
          content: max_boost_explainer(
            new_user_boost_mutliplier,
            max_boost_mutliplier,
            (interaction.member as Discord.GuildMember).premiumSince
              ? false
              : true
          ),
          components: [
            new Discord.ActionRowBuilder<Discord.ButtonBuilder>().addComponents(
              new Discord.ButtonBuilder()
                .setCustomId("cancel")
                .setLabel("Cancel this command")
                .setStyle(Discord.ButtonStyle.Primary),
              new Discord.ButtonBuilder()
                .setCustomId("use_anyway")
                .setLabel("Use anyway")
                .setStyle(Discord.ButtonStyle.Secondary)
            ),
          ],
        });
        let cancelled = false;
        await reply
          .awaitMessageComponent({
            filter: (interaction) => interaction.isButton(),
            time: 60 * 1000,
          })
          .then((i) => {
            if (i.customId === "cancel") {
              interaction.editReply({ content: "Cancelled", components: [] });
              cancelled = true;
            }
          })
          .catch((err) => {
            interaction.editReply({
              content:
                "I went ahead and canceled this for you since you waited quite a while to click a button.",
              components: [],
            });
          });
        if (cancelled) return;
        await db.all(
          SQL`UPDATE xp_boosts SET unclaimed_time_ms = ${boost_ms_remaining}, end_timestamp = ${new_end_timestamp} WHERE id = ${id}`
        );
        interaction.editReply({
          content: redemption_success_message(new_end_timestamp),
          components: [],
        });
      }
    }
  },
  options: {
    server_cooldown: 0,
  },
};

const redemption_success_message = (timestamp) =>
  `### ⚡ Redemption successful!\n\n▸ Boost activated until <t:${Math.floor(
    timestamp / 1000
  )}:F>!\n▸ Godspeed! ᕙ(  •̀ ᗜ •́  )ᕗ`;
const max_boost_explainer = (
  attempted_multiplier,
  max_multiplier,
  show_boost_ad
) =>
  `### Woah there!
▸ After using this boost, your multiplier would be **${attempted_multiplier}x**, which exceeds the limit of **${max_multiplier}x**.
▸ While you can still use the boost, your multiplier won't go any higher than **${max_multiplier}x**, so it's probably not a good idea to use it now.` +
  (show_boost_ad
    ? `\n▸ If you were boosting, your maximum would be **${config.server.leveling.max_xp_boost_multipliers.boosters}x** XP!`
    : ``);
