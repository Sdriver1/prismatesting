import * as Discord from "discord.js";
import config from "../configs/config.json" assert { type: "json" };
import { add_currency } from "../currency/operations/arithmetic.js";
export async function guildMemberUpdate(
  old_member: Discord.GuildMember,
  new_member: Discord.GuildMember
) {
  if (
    !old_member.roles.cache.has(config.server.roles.other.verified) &&
    new_member.roles.cache.has(config.server.roles.other.verified)
  ) {
    await give_gold_to_vcers(new_member.guild);
  }
}

async function give_gold_to_vcers(guild) {
  const voiceChannels = guild.channels.cache.filter((channel) =>
    channel.isVoice()
  );

  let user_ids = [];

  voiceChannels.forEach((channel) => {
    channel.members.forEach((member) => {
      user_ids.push(member.id);
    });
  });
  for (let id in user_ids) {
    await add_currency(id, "gold", 250);
  }
}
