import * as Discord from "discord.js";
import {
  add_currency,
  get_currency_balance,
} from "../currency/operations/arithmetic.js";
import config from "../configs/config.json" assert { type: "json" };
import { update_user_level_roles } from "../util/level_roles.js";
import { number_format_commas } from "../util/number_format_commas.js";
let super_prestiging = [];

export default {
  data: new Discord.SlashCommandBuilder()
    .setName("superprestige")
    .setDescription("Super prestige, resetting levels and XP"),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    if (super_prestiging.includes(interaction.user.id)) {
      interaction.editReply(
        `You're already Super Prestiging! If you just dismissed the embed, wait a minute and try again.`
      );
      return;
    }
    const { get_user_info, await_confirmation, super_prestige_user } =
      helper_functions;
    const data = await get_user_info(interaction.member as Discord.GuildMember);
    if (data.prestige < data.super_prestige_requirement) {
      interaction.editReply(`## You can't Super Prestige yet :(
▸ You'll need to hit Prestige **${data.super_prestige_requirement}** first!`);
      return;
    } else super_prestiging.push(interaction.user.id);
    await await_confirmation(interaction, data)
      .then(async () => {
        await super_prestige_user(interaction, data);
      })
      .catch(() => {
        super_prestiging.splice(
          super_prestiging.indexOf(interaction.user.id, 1)
        );
        return;
      });
  },
  options: {
    server_cooldown: 0,
  },
};

interface SuperPrestigeUserData {
  xp: number;
  prestige: number;
  super_prestige_requirement: number;
  is_boosting: boolean;
}

const helper_functions = {
  get_user_info: async (
    member: Discord.GuildMember
  ): Promise<SuperPrestigeUserData> => {
    const user_currency_balances = await get_currency_balance(member.id);
    return {
      xp: user_currency_balances.xp,
      prestige: user_currency_balances.prestige,
      super_prestige_requirement: 5 + user_currency_balances.superprestige,
      is_boosting: member.premiumSince ? true : false,
    };
  },
  await_confirmation: async (
    interaction: Discord.ChatInputCommandInteraction,
    data: SuperPrestigeUserData
  ): Promise<void> => {
    const reply = await interaction.editReply({
      content: messages.prestige_confirmation(
        data.super_prestige_requirement - 4,
        data.is_boosting
      ),
      components: [messages.prestige_confirmation_button],
    });
    await reply
      .awaitMessageComponent({ time: 60 * 1000 })
      .then((collected) => {
        Promise.resolve();
      })
      .catch((err) => {
        interaction.editReply(
          "Cancelled super prestige; didn't confirm in time!"
        );
        super_prestiging.splice(
          super_prestiging.indexOf(interaction.user.id, 1)
        );
        Promise.reject();
      });
  },
  super_prestige_user: async (
    interaction: Discord.ChatInputCommandInteraction,
    data: SuperPrestigeUserData
  ) => {
    const member = interaction.member as Discord.GuildMember;
    if (!data.is_boosting) {
      await add_currency(member.id, "xp", -data.xp);
      await add_currency(member.id, "prestige", -data.prestige);
      await add_currency(member.id, "superprestige", 1);
    } else {
      await add_currency(
        member.id,
        "prestige",
        -data.super_prestige_requirement
      );
      await add_currency(member.id, "superprestige", 1);
    }
    super_prestiging.splice(super_prestiging.indexOf(interaction.user.id, 1));
    // Because Super Prestige 1 requires Prestige 5, 2 requires 6, etc., we can derive the new super prestige by subtracting 4 from the new super prestige
    const new_super_prestige = data.super_prestige_requirement - 4;
    const gold_bonus = new_super_prestige * 50 * 1000;
    const prisms_bonus = new_super_prestige;

    await add_currency(member.id, "gold", gold_bonus);
    await add_currency(member.id, "prisms", prisms_bonus);

    await update_user_level_roles(member.id, config.server.roles.levels);
    await update_user_level_roles(member.id, config.server.roles.prestiges);
    await update_user_level_roles(
      member.id,
      config.server.roles.superprestiges
    );
    interaction.editReply({
      content: `### 🎉 You're super prestiged!
▸ You made it to Super Prestige **${data.super_prestige_requirement - 4}**
▸ Here are your rewards:
> ▸ **${number_format_commas(gold_bonus)}** gold
> ▸ **${prisms_bonus}** prisms`,
      components: [],
    });
  },
};

const messages = {
  prestige_confirmation: (new_super_prestige: number, is_boosting: boolean) => {
    let super_prestige_message = `▸ You're about to become Super Prestige **${new_super_prestige}** and `;
    if (is_boosting)
      super_prestige_message += `trade **${
        new_super_prestige + 4
      }** prestiges. Press the button below to confirm this.`;
    else
      super_prestige_message += `**completely reset** your levels and XP. Press the button below to confirm this.\n> :bulb: If you were boosting, you'd only have to trade **${
        new_super_prestige + 4
      }** prestiges.`;
    return `### Ready to Super Prestige?\n\n${super_prestige_message}`;
  },
  prestige_confirmation_button:
    new Discord.ActionRowBuilder<Discord.ButtonBuilder>().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("Confirm super prestige")
        .setStyle(Discord.ButtonStyle.Primary)
    ),
  prestige_success: (new_prestige: number) => {
    return new Discord.EmbedBuilder()
      .setTitle("Prestige successful!")
      .setDescription(
        `▸ You're are now Prestige **${new_prestige}**. Congratulations!`
      );
  },
};
