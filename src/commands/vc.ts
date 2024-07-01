import * as Discord from "discord.js";
import { revive_process } from "../command_parts/revive.js";
import config from "../configs/config.json" assert { type: "json" };
export default {
  data: new Discord.SlashCommandBuilder()
    .setName("vc")
    .setDescription("Start a voice chat!")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to include with the VC ping")
    )
    .addStringOption((option) =>
      option
        .setName("embed_title_override")
        .setDescription(
          "Override the randomly-picked embed title (boosters only)"
        )
    )
    .addStringOption((option) =>
      option
        .setName("embed_color_override")
        .setDescription(
          "Override the randomly-picked embed color (boosters only)"
        )
    ),
  run: async function (interaction: Discord.ChatInputCommandInteraction) {
    if (interaction.channelId !== config.server.channels.chat) {
      interaction.editReply(
        `This command only works in <#${config.server.channels.chat}>! (  •̀ ᴖ •́  )`
      );
      return;
    } else {
      const voice_role = interaction.guild.roles.resolve(
        config.server.roles.pings.vc
      );
      const member = interaction.member as Discord.GuildMember;
      const message = interaction.options.getString("message");
      const embed_title_override = interaction.options.getString(
        "embed_title_override"
      );
      const embed_color_override = interaction.options.getString(
        "embed_color_override"
      );
      const boosting = member.premiumSince ? true : false;
      await revive_process(interaction, {
        role_to_ping: voice_role,
        revive_message: message,
        embed_title_override: embed_title_override,
        embed_color_override: embed_color_override,
        channel: interaction.channel as Discord.TextChannel,
        boosting: boosting,
      });
    }
  },
  options: {
    server_cooldown: 3 * 60 * 60 * 1000,
  },
};
