import * as Discord from "discord.js";
import config from "../configs/config.json" assert { type: "json" };
import { client } from "../startup/client.js";

const automod = {
  scanners: {
    contains_bad_words: (string: string) => {
      const bad_words = config.server.automod.bad_words;
      for (const word of bad_words) {
        if (string.includes(word)) {
          return true;
        }
      }
      return false;
    },
    is_correct_count(old_number: number, new_number: number): boolean {
      if (old_number + 1 === new_number) return false;
      return true;
    },
  },
  actions: {
    warn_user(
      user: Discord.User,
      reason: string,
      moderator_name: string,
      embed_color: Discord.HexColorString
    ) {
      try {
        user.send({
          embeds: [
            embeds.offense_documentation_embed({
              reason: `${reason}`,
              mod_action: "Warning",
              moderator_name: `${moderator_name}`,
              user_name: `${user.username}`,
              embed_color: `${embed_color}`,
              include_mod_action_threat: true,
            }),
          ],
        });
      } catch {}
    },
    log_offense(
      user: Discord.User,
      mod_action: string,
      reason: string,
      moderator_name: string,
      embed_color: Discord.HexColorString
    ) {
      const log_channel = client.channels.cache.get(
        config.server.channels.modlogs
      );
      if (!log_channel || !log_channel.isTextBased())
        throw new Error(
          "Automod log channel is configured improperly -- must be a text channel that the bot has permissions to view."
        );
      try {
        log_channel.send({
          embeds: [
            embeds.offense_documentation_embed({
              reason: `${reason}`,
              mod_action: `${mod_action}`,
              moderator_name: `${moderator_name}`,
              user_name: `${user.username}`,
              embed_color: `${embed_color}`,
              include_mod_action_threat: false,
            }),
          ],
        });
      } catch {
        throw new Error("The bot cannot type in the automod log channel.");
      }
    },
  },
};
const embeds = {
  offense_documentation_embed({
    reason,
    mod_action,
    user_name,
    moderator_name,
    embed_color,
    include_mod_action_threat,
  }: {
    reason: string;
    mod_action: string;
    user_name: string;
    moderator_name: string;
    embed_color: Discord.HexColorString;
    include_mod_action_threat: boolean;
  }): Discord.EmbedBuilder {
    let embed_description = "▸ Reason: " + reason + "\n";
    embed_description += "▸ Moderator: " + moderator_name + "\n";
    if (include_mod_action_threat)
      embed_description +=
        "▸ This warning has been documented and recorded. If you fail to correct your behavior, increasingly severe mod action will be taken on you.";
    let warning_embed = new Discord.EmbedBuilder()
      .setTitle(`${mod_action} documentation for ${user_name}`)
      .setDescription(embed_description)
      .setColor(embed_color);
    return warning_embed;
  },
};
export { automod };
