import * as Discord from "discord.js";
import { db } from "../startup/db.js";
import {
  activate_boost,
  generate_multiplier_warning,
} from "../command_parts/xp_boosts.js";
import { get_user_xp_multiplier } from "../currency/operations/arithmetic.js";
import SQL from "sql-template-strings";
import config from "../configs/config.json" assert { type: "json" };
import { get_available_boosts } from "../command_parts/xp_boosts.js";

interface XPBoost {
  multiplier: number;
  unclaimed_time_ms: number;
  owner_id: string;
  end_timestamp: number;
  id: number;
}

export default {
  data: new Discord.SlashCommandBuilder()
    .setName("boosts")
    .setDescription("See all boosts available to you")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The person whose inventory to view")
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    let target = interaction.options.getUser("target");
    if (!(target instanceof Discord.User)) target = interaction.user;
    const show_select_menu = target.id === interaction.user.id ? true : false;
    let menu: any = {};
    menu.content =
      `## ${target.displayName}'s boosts\n` +
      (await list_available_boosts(target.id));
    if (show_select_menu && (await get_boost_selector(target.id)))
      menu.components = [await get_boost_selector(target.id)];
    interaction.editReply(menu).then(async (reply) => {
      const collector = await reply.createMessageComponentCollector({
        time: 10 * 60 * 1000,
      });
      collector.on("collect", async (menu_interaction) => {
        await use_boosts(
          interaction,
          menu_interaction as Discord.StringSelectMenuInteraction
        );
      });
      collector.on("end", (collected) => {
        interaction.editReply({ components: [] });
      });
    });
  },
  options: {
    server_cooldown: 0,
  },
};

async function list_available_boosts(user_id: string): Promise<string> {
  let boosts = await get_available_boosts(user_id);
  if (!boosts[0]) return "This user has no boosts :(";
  boosts = boosts.filter(
    (boost) => boost.unclaimed_time_ms > 0 || boost.end_timestamp > Date.now()
  );
  return boosts
    .map(
      (boost) =>
        `▸ ID \`${boost.id}\`: **${boost.multiplier}**x XP, **${
          boost.unclaimed_time_ms / 1000 / 60
        }** minutes available ${
          boost.end_timestamp && boost.end_timestamp > Date.now()
            ? `\| Active until <t:${Math.floor(boost.end_timestamp / 1000)}:F>`
            : ``
        }`
    )
    .join("\n");
}

async function get_boost_selector(user_id: string) {
  const boosts = (await get_available_boosts(user_id)).filter(
    (boost) => boost.unclaimed_time_ms >= 10 * 60 * 1000
  );
  if (!boosts[0]) return null;
  const boost_selector = new Discord.StringSelectMenuBuilder()
    .setPlaceholder("Use a boost for 10 minutes")
    .setCustomId("boost_selector")
    .setMinValues(1)
    .setMaxValues(boosts.length)
    .addOptions(
      boosts.map((boost) => ({
        label: `${boost.multiplier}x, ${
          boost.unclaimed_time_ms / 60 / 1000
        } mins available`,
        value: `${boost.id}`,
      }))
    );
  return new Discord.ActionRowBuilder<Discord.StringSelectMenuBuilder>().addComponents(
    boost_selector
  );
}

async function use_boosts(
  interaction: Discord.ChatInputCommandInteraction,
  menu_interaction: Discord.StringSelectMenuInteraction
) {
  const values = menu_interaction.values;
  let boosts = [];
  for (let id of values) {
    boosts.push(await db.get(SQL`SELECT * FROM xp_boosts WHERE id = ${id}`));
  }
  const attempted_multiplier =
    (await get_user_xp_multiplier(menu_interaction.user.id)) *
    boosts.reduce((total, boost) => total * boost.multiplier, 1);
  const multiplier_limit = (menu_interaction.member as Discord.GuildMember)
    .premiumSince
    ? config.server.leveling.max_xp_boost_multipliers.boosters
    : config.server.leveling.max_xp_boost_multipliers.default;
  if (attempted_multiplier < multiplier_limit) {
    for (let boost of boosts)
      await activate_boost(Number(boost.id), 10 * 60 * 1000);
    await interaction.editReply({
      content:
        `## ${menu_interaction.user.displayName}'s boosts\n` +
        (await list_available_boosts(menu_interaction.user.id)),
      components: [await get_boost_selector(menu_interaction.user.id)],
    });
    await menu_interaction.reply({
      ephemeral: true,
      content: `${
        menu_interaction.values.length > 1 ? `Boosts` : `Boost`
      } **successfully** activated!`,
    });
  } else {
    await menu_interaction.reply({
      ephemeral: true,
      content: await generate_multiplier_warning(
        attempted_multiplier,
        multiplier_limit,
        (menu_interaction.member as Discord.GuildMember).premiumSince
          ? true
          : false
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
    (await menu_interaction.fetchReply())
      .awaitMessageComponent({
        filter: (interaction) => interaction.isButton(),
        time: 60 * 1000,
      })
      .then(async (confirm_interaction) => {
        if (confirm_interaction.customId === "cancel") {
          menu_interaction.editReply({ content: "Cancelled", components: [] });
        } else {
          for (let boost of boosts) {
            await activate_boost(Number(boost.id), 10 * 60 * 1000);
          }
          await interaction.editReply({
            content:
              `## ${menu_interaction.user.displayName}'s boosts\n` +
              (await list_available_boosts(menu_interaction.user.id)),
            components: [],
          });
          await menu_interaction.editReply({
            content: `${
              menu_interaction.values.length > 1 ? `Boosts` : `Boost`
            } **successfully** activated!`,
            components: [],
          });
        }
      })
      .catch((err) => {
        console.log(err);
        menu_interaction.editReply({
          content:
            "I went ahead and canceled this for you since you waited quite a while to click a button.",
          components: [],
        });
      });
  }
}
