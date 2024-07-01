import { db } from "../startup/db.js";
import SQL from "sql-template-strings";
import { does_currency_exist } from "../currency/operations/does_currency_exist.js";

interface LeaderboardBuilderData {
  min_index: number;
  max_index: number;
  currency_id: string;
}

interface LeaderboardCurrencyData {
  user_id: string;
  amount: number;
}
export async function get_currency_leaderboard(
  data: LeaderboardBuilderData
): Promise<LeaderboardCurrencyData[]> {
  if (!(await does_currency_exist(data.currency_id))) {
    throw new Error("Make sure you specified a valid currency!");
  }
  if (data.max_index < data.min_index)
    throw new Error("Minimum index should not be greater than maximum index");
  const rows = await db.all(
    SQL`SELECT user_id, amount FROM user_currencies WHERE currency_id = ${data.currency_id} ORDER BY amount DESC`
  );
  let result = [];
  for (let i = data.min_index; i < data.max_index; i++) {
    if (rows[i]) result.push(rows[i]);
  }
  return result;
}
