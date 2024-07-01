import SQL from "sql-template-strings";
import { db } from "../../startup/db.js";

export async function does_currency_exist(
  currency_id: string
): Promise<boolean> {
  try {
    const result = await db.get(
      SQL`SELECT * FROM currency_config WHERE currency_id = ${currency_id}`
    );
    if (result) return true;
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}
