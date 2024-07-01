import * as Discord from "discord.js";
import config from "../configs/config.json" assert { type: "json" };
import { purge_member_currencies } from "../currency/operations/arithmetic.js";
export function guildBanAdd(ban: Discord.GuildBan) {
  if (ban.guild.id !== config.server.id) return;
  purge_member_currencies(ban.user.id);
}
