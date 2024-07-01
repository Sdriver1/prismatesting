import "dotenv/config";
import { register_commands } from "../startup/commands.js";
import { client } from "../startup/client.js";
import config from "../configs/config.json" assert { type: "json" };
import { db } from "../startup/db.js";
import SQL from "sql-template-strings";
import {
  add_currency,
  add_user_xp,
} from "../currency/operations/arithmetic.js";
import { get_user_xp_multiplier } from "../currency/operations/arithmetic.js";
import * as Discord from "discord.js";

export async function ready() {
  register_commands();

  setInterval(async () => {
    const guild = await client.guilds.resolve(config.server.id).fetch();
    const voice_states = guild.voiceStates.cache.values();
    for (let voice_state of voice_states) {
      if (!voice_state.channel) return;
      if (
        !voice_state.member.user.bot &&
        voice_state.channel.members.filter((member) => !member.user.bot).size >
          2
      ) {
        add_user_xp(
          voice_state.member.id,
          10 *
            (await get_user_xp_multiplier(
              voice_state.member.id,
              voice_state.channel.id
            )),
          voice_state.channel
        );
        add_currency(voice_state.member.id, "Voice minutes this week", 1);
        add_currency(voice_state.member.id, "Voice minutes this month", 1);
        add_currency(voice_state.member.id, "Voice minutes", 1);
      }
    }
  }, 60 * 1000);
  setInterval(async () => {
    let boosts = await db.all(SQL`SELECT * from xp_boosts`);
    for (let boost of boosts) {
      if (boost.unclaimed_time_ms === 0 && boost.end_timestamp < Date.now())
        await db.run(`DELETE FROM xp_boosts WHERE id = ${boost.id}`);
    }
  }, 60 * 1000);
  setInterval(
    async () => {
      (
        client.channels.resolve(
          config.server.channels.xp_logs
        ) as Discord.TextChannel
      ).send({
        content: "Here's a copy of the database.",
        files: ["data/main.db"],
      });
    },
    60 * 60 * 1000
  );
  console.log("Ready!");
}
