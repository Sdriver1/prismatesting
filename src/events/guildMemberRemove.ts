import * as Discord from "discord.js";
import config from "../configs/config.json" assert { type: "json" };
import { purge_member_currencies } from "../currency/operations/arithmetic.js";
export function guildMemberRemove(member: Discord.GuildMember) {
  if (member.guild.id !== config.server.id) return;
  purge_member_currencies(member.id);
}
