import { db } from "../../startup/db.js";
import SQL from "sql-template-strings";

export interface XPBoostData {
  multiplier: number;
  unclaimed_time_ms: number;
  owner_id: string;
  id?: string;
}

export interface ExtendXPBoostData {
  id: string;
  extend_ms: number;
}

export async function edit_xp_boost(data: XPBoostData) {
  const boost = await db.get(
    SQL`SELECT * FROM xp_boosts where id = ${data.id}`
  );
  await db.run(
    `UPDATE xp_boosts SET multiplier = ${
      data.multiplier ?? boost.multiplier
    }, owner_id = ${data.owner_id ?? boost.owner_id}, unclaimed_time_ms = ${
      data.unclaimed_time_ms || boost.unclaimed_time_ms
    } WHERE id = ${data.id}`
  );
}
export async function generate_boost_id(): Promise<string> {
  const booster_id_list = (await db.all(SQL`SELECT id FROM xp_boosts`)).map(
    (boost) => boost.id
  );
  if (!booster_id_list[0]) return `1`;
  else {
    let id = 1;
    while (booster_id_list.includes(id)) id++;
    return id.toString();
  }
}
export async function extend_xp_boost(data: ExtendXPBoostData): Promise<void> {
  const xp_boost = await db.get(
    `SELECT * from xp_boosts WHERE id = ${data.id}`
  );
  const old_ms = xp_boost.unclaimed_time_ms;
  const new_ms = old_ms + data.extend_ms;
  await db.run(
    SQL`UPDATE xp_boosts SET unclaimed_time_ms = ${new_ms} WHERE id = ${data.id}`
  );
}
export async function generate_xp_boost(data: XPBoostData): Promise<void> {
  try {
    await db.run(
      SQL`INSERT INTO xp_boosts (id, unclaimed_time_ms, multiplier, owner_id) VALUES (${
        data.id ?? (await generate_boost_id())
      }, ${data.unclaimed_time_ms}, ${data.multiplier}, ${data.owner_id})`
    );
  } catch (err) {
    await generate_xp_boost(data);
  }
}
