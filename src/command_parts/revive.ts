import * as Discord from "discord.js";
import { random_from_array } from "../util/random_from_array.js";
import config from "../configs/config.json" assert { type: "json" };
import { automod } from "../util/automod.js";
import { random_embed_color } from "../util/random_embed_color.js";

interface ReviveMessageData {
  role_to_ping: Discord.Role;
  revive_message: string;
  embed_title_override: string;
  embed_color_override: string;
  channel: Discord.TextChannel;
  boosting: boolean;
}

export async function revive_process(
  interaction: Discord.ChatInputCommandInteraction,
  data: ReviveMessageData
) {
  if (
    (data.embed_color_override !== null ||
      data.embed_title_override !== null) &&
    !data.boosting
  ) {
    send_not_boosting_error(interaction, data);
  } else send_revive_message(interaction, data);
}
export async function send_revive_message(
  interaction,
  data: ReviveMessageData
) {
  if (data.embed_title_override) {
    if (data.embed_title_override.length > 2000)
      data.embed_title_override = "[Embed title truncated for being too long]";
    if (automod.scanners.contains_bad_words(data.embed_title_override))
      data.embed_title_override =
        "[Embed title blocked by Prisma due to bad words]";
  }
  if (data.revive_message) {
    if (data.revive_message.length > 2000)
      data.revive_message = "[Revive message truncated for being too long]";
    if (automod.scanners.contains_bad_words(data.revive_message))
      data.revive_message =
        "[Revive message blocked by Prisma due to bad words]";
  }
  const hex_code_regex = /^#?([0-9A-Fa-f]{6})$/i;
  if (!hex_code_regex.test(data.embed_color_override))
    data.embed_color_override = random_embed_color();
  const revive_embed = new Discord.EmbedBuilder()
    .setAuthor({
      name: interaction.member.displayName,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTitle(
      data.embed_title_override
        ? data.embed_title_override
        : random_from_array(config.server.default_embed_titles.revive)
    )
    .setColor(data.embed_color_override as Discord.ColorResolvable)
    .setDescription(
      "Hey! Everyone hop in chat! Feel free to toggle this ping in <id:customize>."
    );
  data.channel.send({
    content: `${data.role_to_ping} ${
      data.revive_message ? data.revive_message.replace(/@/g, "@ ") : ``
    }`,
    embeds: [revive_embed],
  });
  interaction.editReply({
    content: "Done!",
  });
}

export async function send_not_boosting_error(
  interaction: Discord.ChatInputCommandInteraction,
  data: ReviveMessageData
) {
  await interaction.editReply({
    embeds: [embeds.not_boosting.embed],
    components: [embeds.not_boosting.action_row],
  });
  const reply = await interaction.fetchReply();
  await_not_boosting_error_reply(reply, data, interaction);
}

export async function await_not_boosting_error_reply(
  message: Discord.Message,
  data: ReviveMessageData,
  interaction: Discord.Interaction
) {
  const is_button = (interaction) => interaction.isButton();
  message
    .awaitMessageComponent({ filter: is_button, time: 60_000 })
    .then((i) => {
      if (i.customId === "send") {
        data.embed_color_override = null;
        data.embed_title_override = null;
        send_revive_message(interaction, data);
        i.update({
          content: "Done!",
          embeds: [],
          components: [],
        });
      } else {
        (interaction as Discord.ChatInputCommandInteraction).editReply({
          content: "Cancelled!",
          embeds: [],
          components: [],
        });
        return;
      }
    })
    .catch((error) => {
      message.edit(
        "There was an option to revive anyway or cancel here, but you took to long to click a button, so I canceled the command."
      );
    });
}

const embeds = {
  not_boosting: {
    embed: new Discord.EmbedBuilder().setTitle(
      "You must be boosting to override the embed's color and title!"
    ),
    action_row:
      new Discord.ActionRowBuilder<Discord.ButtonBuilder>().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId(`send`)
          .setLabel("Revive without overrides")
          .setStyle(Discord.ButtonStyle.Primary),
        new Discord.ButtonBuilder()
          .setCustomId(`cancel`)
          .setLabel("Cancel the command")
          .setStyle(Discord.ButtonStyle.Secondary)
      ),
  },
};
