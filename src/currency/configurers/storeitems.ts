import { get_store_item } from "../operations/storeitems.js";
import SQL from "sql-template-strings";
import { db } from "../../startup/db.js";

export interface StoreItemData {
  item_name: string;
  description: string;
  price: number;
  currency_required: string;
  role_to_give_id: string | undefined;
  role_duration: number | undefined;
  currency_to_give: string | undefined;
  currency_to_give_amount: number | undefined;
}
export async function create_store_item(data: StoreItemData): Promise<void> {
  if ((await get_store_item(data.item_name)) !== null) {
    throw new Error(`Item ${data.item_name} already exists`);
  }
  await db.run(
    SQL`INSERT INTO store_items (item_name, description, price, currency_required, role_to_give, role_duration, currency_to_give, currency_to_give_amount) VALUES (${data.item_name}, ${data.description}, ${data.price}, ${data.currency_required}, ${data.role_to_give_id}, ${data.role_duration}, ${data.currency_to_give}, ${data.currency_to_give_amount})`
  );
}
export async function configure_store_item(data: StoreItemData) {
  if ((await get_store_item(data.item_name)) === null) {
    throw new Error(`Item ${data.item_name} does not exist`);
  }
  await db.run(
    SQL`UPDATE store_items SET description = ${data.description}, price = ${data.price}, currency_required = ${data.currency_required}, role_to_give = ${data.role_to_give_id}, role_duration = ${data.role_duration}, currency_to_give = ${data.currency_to_give}, currency_to_give_amount = ${data.currency_to_give_amount} WHERE item_name = ${data.item_name}`
  );
}
export async function delete_store_item(item_name: string) {
  if ((await get_store_item(item_name)) === null) {
    throw new Error(`Item ${item_name} does not exist`);
  }
  await db.run(SQL`DELETE FROM store_items WHERE item_name = ${item_name}`);
}
