import config from "../configs/config.json" assert { type: "json" };
import { client } from "../startup/client.js";
import { get_currency_balance } from "../currency/operations/arithmetic.js";
import { level } from "../currency/configurers/leveling/formula.js";

/* Used generally for level and perstige roles.

Assumes the array takes the format [[level_a, roleid_a], [level_b, roleid_b]].
Given level, finds the roleid corresponding to the level <= the level provided to the function where no higher level exists that satisfies this condition.

This function may output unusual results if the array isn't ordered.
*/

export function get_level_role(level: number, level_role_array: any[]) {
  const eligible_roles = level_role_array.filter(
    ([level_required]) => level >= level_required
  );
  const max_level = Math.max(
    ...eligible_roles.map(([level_required]) => level_required)
  );
  const highest_eligible_role = eligible_roles.find(
    ([level_required]) => level_required === max_level
  );
  if (highest_eligible_role) return highest_eligible_role[1];
  else return undefined;
}

export async function update_user_level_roles(
  user_id: string,
  level_role_array: any[]
) {
  const guild = client.guilds.resolve(config.server.id);
  const member = guild.members.resolve(user_id);
  const xp = await get_currency_balance(member.id, "xp");
  const member_level = level(xp);
  const level_role_ids = level_role_array.map(([, roleid]) => roleid);
  await member.roles.remove(level_role_ids);
  const member_level_role = get_level_role(member_level, level_role_array);
  if (member_level_role) await member.roles.add(member_level_role);
}
