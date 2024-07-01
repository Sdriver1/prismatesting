import { db } from "../startup/db.js";
import SQL from "sql-template-strings";
import config from "../configs/config.json" assert { type: "json" };

interface XPBoost {
  multiplier: number;
  unclaimed_time_ms: number;
  owner_id: string;
  end_timestamp: number;
  id: number;
}

export async function activate_boost(id: number, ms: number) {
  const boost = await db.get(SQL`SELECT * FROM xp_boosts WHERE id = ${id}`);
  if (!boost) throw new Error("Boost not found!");
  if (ms > boost.unclaimed_time_ms)
    throw new Error("You can't use a boost for longer than you have!");
  const current_timestamp = Date.now();
  const existing_end_timestamp = boost.end_timestamp;
  const new_end_timestamp =
    Math.max(existing_end_timestamp || 0, current_timestamp) + ms;
  await db.all(
    SQL`UPDATE xp_boosts SET unclaimed_time_ms = ${
      boost.unclaimed_time_ms - ms
    }, end_timestamp = ${new_end_timestamp} WHERE id = ${id}`
  );
}

export async function generate_multiplier_warning(
  attempted_multiplier: number,
  max_multiplier: number,
  show_boost_ad: boolean
): Promise<string> {
  return (
    `### Woah there!
  ▸ After using this boost, your multiplier would be **${attempted_multiplier}x**, which exceeds the limit of **${max_multiplier}x**.
  ▸ While you can still use the boost, your multiplier won't go any higher than **${max_multiplier}x**, so it's probably not a good idea to use it now.` +
    (show_boost_ad
      ? `\n▸ If you were boosting, your maximum would be **${config.server.leveling.max_xp_boost_multipliers.boosters}x** XP!`
      : ``)
  );
}

export async function get_available_boosts(
  user_id: string
): Promise<XPBoost[]> {
  let boosts = await db.all(
    `SELECT * FROM xp_boosts WHERE owner_id = ${user_id}`
  );
  boosts = boosts.filter(
    (boost) => boost.unclaimed_time_ms > 0 || boost.end_timestamp > Date.now()
  );
  return boosts;
}
