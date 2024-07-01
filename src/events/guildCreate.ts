import { Guild } from "discord.js";

export async function guildCreate(guild: Guild) {
  if (guild.id === "1169381800741711923") return;
  const owner = await guild.fetchOwner();
  owner.send({
    content: `### What is this place?\n- Someone invited me to your server, but I only work in [Prismatic](<https://discord.gg/friendships>)!\n- I'm scared of other servers 〣 ( ºΔº ) 〣\n- Anyway, congrats on finding this easter egg if you invited this bot! If you didn't, you should probably talk to your admins about inviting random bots.`,
  });
  await guild.leave();
}
