import { db } from "../../startup/db.js";
import SQL from "sql-template-strings";
export async function get_store_item(item_name: string) {
  try {
    const result = await db.get(
      SQL`SELECT * FROM store_items WHERE item_name = ${item_name}`
    );
    if (result !== undefined && result !== null) return result;
    return null;
  } catch (err) {
    return null;
  }
}
export async function get_currency_store(currency_name: string) {
  return await db.all(
    SQL`SELECT * FROM store_items WHERE currency_required = ${currency_name}`
  );
}
