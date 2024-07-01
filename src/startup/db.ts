import * as fs from "node:fs";
import sqlite3 from "sqlite3";
import SQL from "sql-template-strings";
import { open } from "sqlite";
import "dotenv/config";
import { does_currency_exist } from "../currency/operations/does_currency_exist.js";
import config from "../configs/config.json" assert { type: "json" };

export function create_dir(dir_path: string) {
  try {
    fs.statSync(dir_path);
  } catch {
    try {
      fs.mkdirSync(dir_path);
    } catch (err) {
      console.log(err);
    }
  }
}

create_dir("./data");
if (process.env.NODE_ENV == "development") sqlite3.verbose();

export const db = await open({
  filename: "./data/main.db",
  driver: sqlite3.Database,
});

// Create variable currencies equal to an array of every value under the "name" column in currency_config

await db.exec(
  SQL`CREATE TABLE IF NOT EXISTS user_currencies (user_id TEXT, currency_id TEXT, amount INTEGER)`
);
await db.exec(
  SQL`CREATE TABLE IF NOT EXISTS currency_config (currency_id TEXT UNIQUE, transferrable BOOLEAN, message_auto_give INTEGER, boost_auto_give INTEGER, can_be_negative BOOLEAN, can_be_deleted BOOLEAN)`
);
await db.exec(
  SQL`CREATE TABLE IF NOT EXISTS store_items (item_name TEXT UNIQUE, currency_required TEXT, price INTEGER, description TEXT, role_to_give TEXT, role_duration INTEGER, currency_to_give TEXT, currency_to_give_amount INTEGER)`
);
await db.exec(
  SQL`CREATE TABLE IF NOT EXISTS xp_boosts (id INTEGER UNIQUE, unclaimed_time_ms INTEGER, multiplier INTEGER, owner_id TEXT, end_timestamp INTEGER)`
);
await db.exec(
  SQL`CREATE TABLE IF NOT EXISTS server_command_cooldowns (name TEXT, next_available_timestamp TEXT)`
);
await db.exec(
  SQL`CREATE TABLE IF NOT EXISTS rewards (messages INTEGER, xp_boost_multiplier INTEGER, xp_boost_duration INTEGER, currency_to_give TEXT, currency_to_give_amount INTEGER, role_id TEXT)`
);
// I can't use an array in .env for some reason
await load_default_currencies(config.server.default_currencies);

async function load_default_currencies(
  currency_names: string[]
): Promise<void> {
  // Add default currencies to DB
  for (const currency_name of currency_names) {
    if (!(await does_currency_exist(currency_name))) {
      await db.run(
        SQL`INSERT INTO currency_config (currency_id, can_be_deleted) VALUES (${currency_name}, false)`
      );
    }
  }

  // Iterate over currencies and unmark currencies that were once indicated as default but are no longer indicated as default in config
  const currency_configs = await db.all(SQL`SELECT * FROM currency_config`);
  for (let currency_config of currency_configs) {
    if (!currency_names.includes(currency_config.currency_id))
      await db.run(
        SQL`UPDATE currency_config SET can_be_deleted = true WHERE currency_id = ${currency_config.currency_id}`
      );
  }
}
