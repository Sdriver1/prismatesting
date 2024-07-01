import SQL from "sql-template-strings";
import { db } from "../../startup/db.js";
import { does_currency_exist } from "../operations/does_currency_exist.js";

interface CurrencyConfig {
  currency_name: string;
  transferrable: boolean;
  message_auto_give: number;
  boost_auto_give: number;
  can_be_negative: boolean;
  can_be_deleted: boolean;
}

export async function configure_currency(
  currency_name: string,
  transferrable: boolean,
  message_auto_give: number,
  boost_auto_give: number,
  can_be_negative: boolean
): Promise<void> {
  let current_settings = await get_currency_config(currency_name);
  let new_transferrable = transferrable ?? current_settings.transferrable;
  let new_message_auto_give =
    message_auto_give ?? current_settings.message_auto_give;
  let new_boost_auto_give = boost_auto_give ?? current_settings.boost_auto_give;
  let new_can_be_negative = can_be_negative ?? current_settings.can_be_negative;
  await db.run(
    SQL`UPDATE currency_config 
          SET transferrable = ${new_transferrable}, 
              message_auto_give = ${new_message_auto_give}, 
              boost_auto_give = ${new_boost_auto_give},
              can_be_negative = ${new_can_be_negative}
          WHERE currency_id = ${currency_name}`
  );
}

export async function get_currency_config(
  currency_name: string
): Promise<CurrencyConfig> {
  await error_if_doesnt_exist(currency_name);
  const result = await db.get(
    SQL`SELECT * FROM currency_config WHERE currency_id = ${currency_name}`
  );
  if (!result) {
    throw new Error(`No currency config found for currency: ${currency_name}`);
  }
  return result;
}

export async function create_currency(currency_name: string) {
  await error_if_exists(currency_name);
  await db.run(
    SQL`INSERT INTO currency_config (currency_id, can_be_deleted) VALUES (${currency_name}, true)`
  );
}

export async function delete_currency(currency_name: string) {
  await error_if_doesnt_exist(currency_name);
  const can_be_deleted = (await get_currency_config(currency_name))
    .can_be_deleted;
  if (!can_be_deleted)
    throw new Error(
      "This currency cannot be deleted (it has been specified as default in this instance of Star's configuration)"
    );
  await db.run(
    SQL`DELETE FROM currency_config WHERE currency_id = ${currency_name}`
  );
  await db.run(
    SQL`DELETE FROM user_currencies WHERE currency_id = ${currency_name}`
  );
  await db.run(
    SQL`DELETE FROM store_items WHERE currency_required = ${currency_name}`
  );
  await db.run(
    SQL`DELETE FROM store_items WHERE currency_to_give = ${currency_name}`
  );
}

async function error_if_exists(currency_name: string) {
  if (await does_currency_exist(currency_name))
    throw new Error("Currency already exists");
}

async function error_if_doesnt_exist(currency_name: string) {
  if (!(await does_currency_exist(currency_name)))
    throw new Error("Currency does not exist");
}
