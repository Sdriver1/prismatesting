import sqlite3 from "sqlite3";
import SQL from "sql-template-strings";
import { open } from "sqlite";

export const db = await open({
  filename: "./data/main.db",
  driver: sqlite3.Database,
});

const gold_rows = await db.all(
  SQL`SELECT * FROM user_currencies WHERE currency_id = "gold"`
);

const gold_array = gold_rows.map((row) => row.amount);
console.log(gold_array);

console.log(gold_array.reduce((a, b) => a + b));
