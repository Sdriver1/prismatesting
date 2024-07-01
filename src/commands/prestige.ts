import * as Discord from "discord.js";
import {
  add_currency,
  get_currency_balance,
} from "../currency/operations/arithmetic.js";
import { level, xp } from "../currency/configurers/leveling/formula.js";
import config from "../configs/config.json" assert { type: "json" };
import { update_user_level_roles } from "../util/level_roles.js";
let prestiging = [];

export default {
  data: new Discord.SlashCommandBuilder()
    .setName("prestige")
    .setDescription("Prestige and reset your XP"),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    if (prestiging.includes(interaction.user.id)) {
      interaction.editReply({
        content:
          "You are already prestiging! (If you previously dismissed the embed, wait a minute and try again).",
      });
      return;
    }
    const user_data = await get_user_info(
      interaction.member as Discord.GuildMember
    );
    if (!user_data.prestige) user_data.prestige = 0;
    if (user_data.level < user_data.prestige_level_requirement) {
      interaction.editReply({
        embeds: [
          embeds.prestige_ineligible(user_data.prestige_level_requirement),
        ],
      });
      return;
    } else {
      prestiging.push(interaction.user.id);
      const reply = await interaction.editReply({
        embeds: [
          embeds.prestige_confirmation(
            user_data.is_boosting
              ? xp(user_data.prestige_level_requirement)
              : user_data.xp,
            user_data.prestige + 1,
            !user_data.is_boosting
          ),
        ],
        components: [embeds.prestige_confirmation_button],
      });
      reply
        .awaitMessageComponent({
          filter: (confirm_interaction) =>
            confirm_interaction.customId === "confirm" &&
            confirm_interaction.user.id == interaction.user.id,
          time: 60 * 1000,
        })
        .then(async (i) => {
          i.deferReply({ ephemeral: true });
          await add_currency(i.user.id, "prestige", 1);
          await add_currency(
            i.user.id,
            "xp",
            -(user_data.is_boosting
              ? xp(user_data.prestige_level_requirement)
              : user_data.xp)
          );
          await update_user_level_roles(i.user.id, config.server.roles.levels);
          await update_user_level_roles(
            i.user.id,
            config.server.roles.prestiges
          );
          i.editReply({
            embeds: [embeds.prestige_success(user_data.prestige + 1)],
            components: [],
          });
          prestiging.splice(prestiging.indexOf(interaction.user.id, 1));
        })
        .catch((err) => {
          prestiging.splice(prestiging.indexOf(interaction.user.id, 1));
        });
    }
  },
  options: {
    server_cooldown: 0,
  },
};

async function get_user_info(member: Discord.GuildMember) {
  const user_currency_balances = await get_currency_balance(member.id);
  if (!user_currency_balances.prestige) user_currency_balances.prestige = 0;
  if (!user_currency_balances.xp) user_currency_balances.xp = 0;
  return {
    level: level(user_currency_balances.xp),
    xp: user_currency_balances.xp || 0,
    prestige: user_currency_balances.prestige || 0,
    prestige_level_requirement: 25 + user_currency_balances.prestige * 5,
    is_boosting: member.premiumSince ? true : false,
  };
}

const embeds = {
  prestige_confirmation: (
    xp_traded: number,
    new_prestige: number,
    include_boost_ad: boolean
  ) => {
    return new Discord.EmbedBuilder()
      .setTitle("Ready to prestige?")
      .setDescription(
        `▸ You're about to become Prestige **${new_prestige}** and trade **${xp_traded}** XP. Press the button below to confirm this. ${
          include_boost_ad
            ? `\n▸ **:bulb: Pro tip!** Server boosters only have to trade the XP required to reach their prestige level, meaning they save all their bonus XP.`
            : ``
        }`
      );
  },
  prestige_confirmation_button:
    new Discord.ActionRowBuilder<Discord.ButtonBuilder>().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("Confirm my prestige")
        .setStyle(Discord.ButtonStyle.Primary)
    ),
  prestige_success: (new_prestige: number) => {
    return new Discord.EmbedBuilder()
      .setTitle("Prestige successful!")
      .setDescription(
        `▸ You're are now Prestige **${new_prestige}**. Congratulations!`
      );
  },
  prestige_ineligible: (required_level: number) =>
    new Discord.EmbedBuilder()
      .setTitle("You can't prestige yet :(")
      .setDescription(
        `▸ Try again when you reach level **${required_level}**!`
      ),
};
