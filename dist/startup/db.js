import * as fs from "node:fs";
import sqlite3 from "sqlite3";
import SQL from "sql-template-strings";
import { open } from "sqlite";
import "dotenv/config";
import { does_currency_exist } from "../currency/operations/does_currency_exist.js";
import config from "../configs/config.json" with { type: "json" };
export function create_dir(dir_path) {
    try {
        fs.statSync(dir_path);
    }
    catch {
        try {
            fs.mkdirSync(dir_path);
        }
        catch (err) {
            console.log(err);
        }
    }
}
create_dir("./data");
if (process.env.NODE_ENV == "development")
    sqlite3.verbose();
export const db = await open({
    filename: "./data/main.db",
    driver: sqlite3.Database,
});
await db.exec(SQL `CREATE TABLE IF NOT EXISTS user_currencies (user_id TEXT, currency_id TEXT, amount INTEGER)`);
await db.exec(SQL `CREATE TABLE IF NOT EXISTS currency_config (currency_id TEXT UNIQUE, transferrable BOOLEAN, message_auto_give INTEGER, boost_auto_give INTEGER, can_be_negative BOOLEAN, can_be_deleted BOOLEAN)`);
await db.exec(SQL `CREATE TABLE IF NOT EXISTS store_items (item_name TEXT UNIQUE, currency_required TEXT, price INTEGER, description TEXT, role_to_give TEXT, role_duration INTEGER, currency_to_give TEXT, currency_to_give_amount INTEGER)`);
await db.exec(SQL `CREATE TABLE IF NOT EXISTS xp_boosts (id INTEGER UNIQUE, unclaimed_time_ms INTEGER, multiplier INTEGER, owner_id TEXT, end_timestamp INTEGER)`);
await db.exec(SQL `CREATE TABLE IF NOT EXISTS server_command_cooldowns (name TEXT, next_available_timestamp TEXT)`);
await db.exec(SQL `CREATE TABLE IF NOT EXISTS rewards (messages INTEGER, xp_boost_multiplier INTEGER, xp_boost_duration INTEGER, currency_to_give TEXT, currency_to_give_amount INTEGER, role_id TEXT)`);
await load_default_currencies(config.server.default_currencies);
async function load_default_currencies(currency_names) {
    for (const currency_name of currency_names) {
        if (!(await does_currency_exist(currency_name))) {
            await db.run(SQL `INSERT INTO currency_config (currency_id, can_be_deleted) VALUES (${currency_name}, false)`);
        }
    }
    const currency_configs = await db.all(SQL `SELECT * FROM currency_config`);
    for (let currency_config of currency_configs) {
        if (!currency_names.includes(currency_config.currency_id))
            await db.run(SQL `UPDATE currency_config SET can_be_deleted = true WHERE currency_id = ${currency_config.currency_id}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RhcnR1cC9kYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUM5QixPQUFPLE9BQU8sTUFBTSxTQUFTLENBQUM7QUFDOUIsT0FBTyxHQUFHLE1BQU0sc0JBQXNCLENBQUM7QUFDdkMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUNwRixPQUFPLE1BQU0sTUFBTSx3QkFBd0IsQ0FBQyxTQUFTLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUVwRSxNQUFNLFVBQVUsVUFBVSxDQUFDLFFBQWdCO0lBQ3pDLElBQUksQ0FBQztRQUNILEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUFDLE1BQU0sQ0FBQztRQUNQLElBQUksQ0FBQztZQUNILEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVELFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUFJLGFBQWE7SUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFFN0QsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDO0lBQzNCLFFBQVEsRUFBRSxnQkFBZ0I7SUFDMUIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxRQUFRO0NBQ3pCLENBQUMsQ0FBQztBQUlILE1BQU0sRUFBRSxDQUFDLElBQUksQ0FDWCxHQUFHLENBQUEsNkZBQTZGLENBQ2pHLENBQUM7QUFDRixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQ1gsR0FBRyxDQUFBLGtNQUFrTSxDQUN0TSxDQUFDO0FBQ0YsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUNYLEdBQUcsQ0FBQSwyTkFBMk4sQ0FDL04sQ0FBQztBQUNGLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FDWCxHQUFHLENBQUEsK0lBQStJLENBQ25KLENBQUM7QUFDRixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQ1gsR0FBRyxDQUFBLGdHQUFnRyxDQUNwRyxDQUFDO0FBQ0YsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUNYLEdBQUcsQ0FBQSxxTEFBcUwsQ0FDekwsQ0FBQztBQUVGLE1BQU0sdUJBQXVCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRWhFLEtBQUssVUFBVSx1QkFBdUIsQ0FDcEMsY0FBd0I7SUFHeEIsS0FBSyxNQUFNLGFBQWEsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsQ0FBQyxNQUFNLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNoRCxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQ1YsR0FBRyxDQUFBLHFFQUFxRSxhQUFhLFVBQVUsQ0FDaEcsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO0lBR0QsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFBLCtCQUErQixDQUFDLENBQUM7SUFDMUUsS0FBSyxJQUFJLGVBQWUsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUM7WUFDdkQsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUNWLEdBQUcsQ0FBQSx3RUFBd0UsZUFBZSxDQUFDLFdBQVcsRUFBRSxDQUN6RyxDQUFDO0lBQ04sQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tIFwibm9kZTpmc1wiO1xyXG5pbXBvcnQgc3FsaXRlMyBmcm9tIFwic3FsaXRlM1wiO1xyXG5pbXBvcnQgU1FMIGZyb20gXCJzcWwtdGVtcGxhdGUtc3RyaW5nc1wiO1xyXG5pbXBvcnQgeyBvcGVuIH0gZnJvbSBcInNxbGl0ZVwiO1xyXG5pbXBvcnQgXCJkb3RlbnYvY29uZmlnXCI7XHJcbmltcG9ydCB7IGRvZXNfY3VycmVuY3lfZXhpc3QgfSBmcm9tIFwiLi4vY3VycmVuY3kvb3BlcmF0aW9ucy9kb2VzX2N1cnJlbmN5X2V4aXN0LmpzXCI7XHJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ3MvY29uZmlnLmpzb25cIiBhc3NlcnQgeyB0eXBlOiBcImpzb25cIiB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZV9kaXIoZGlyX3BhdGg6IHN0cmluZykge1xyXG4gIHRyeSB7XHJcbiAgICBmcy5zdGF0U3luYyhkaXJfcGF0aCk7XHJcbiAgfSBjYXRjaCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBmcy5ta2RpclN5bmMoZGlyX3BhdGgpO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5jcmVhdGVfZGlyKFwiLi9kYXRhXCIpO1xyXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT0gXCJkZXZlbG9wbWVudFwiKSBzcWxpdGUzLnZlcmJvc2UoKTtcclxuXHJcbmV4cG9ydCBjb25zdCBkYiA9IGF3YWl0IG9wZW4oe1xyXG4gIGZpbGVuYW1lOiBcIi4vZGF0YS9tYWluLmRiXCIsXHJcbiAgZHJpdmVyOiBzcWxpdGUzLkRhdGFiYXNlLFxyXG59KTtcclxuXHJcbi8vIENyZWF0ZSB2YXJpYWJsZSBjdXJyZW5jaWVzIGVxdWFsIHRvIGFuIGFycmF5IG9mIGV2ZXJ5IHZhbHVlIHVuZGVyIHRoZSBcIm5hbWVcIiBjb2x1bW4gaW4gY3VycmVuY3lfY29uZmlnXHJcblxyXG5hd2FpdCBkYi5leGVjKFxyXG4gIFNRTGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyB1c2VyX2N1cnJlbmNpZXMgKHVzZXJfaWQgVEVYVCwgY3VycmVuY3lfaWQgVEVYVCwgYW1vdW50IElOVEVHRVIpYFxyXG4pO1xyXG5hd2FpdCBkYi5leGVjKFxyXG4gIFNRTGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBjdXJyZW5jeV9jb25maWcgKGN1cnJlbmN5X2lkIFRFWFQgVU5JUVVFLCB0cmFuc2ZlcnJhYmxlIEJPT0xFQU4sIG1lc3NhZ2VfYXV0b19naXZlIElOVEVHRVIsIGJvb3N0X2F1dG9fZ2l2ZSBJTlRFR0VSLCBjYW5fYmVfbmVnYXRpdmUgQk9PTEVBTiwgY2FuX2JlX2RlbGV0ZWQgQk9PTEVBTilgXHJcbik7XHJcbmF3YWl0IGRiLmV4ZWMoXHJcbiAgU1FMYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIHN0b3JlX2l0ZW1zIChpdGVtX25hbWUgVEVYVCBVTklRVUUsIGN1cnJlbmN5X3JlcXVpcmVkIFRFWFQsIHByaWNlIElOVEVHRVIsIGRlc2NyaXB0aW9uIFRFWFQsIHJvbGVfdG9fZ2l2ZSBURVhULCByb2xlX2R1cmF0aW9uIElOVEVHRVIsIGN1cnJlbmN5X3RvX2dpdmUgVEVYVCwgY3VycmVuY3lfdG9fZ2l2ZV9hbW91bnQgSU5URUdFUilgXHJcbik7XHJcbmF3YWl0IGRiLmV4ZWMoXHJcbiAgU1FMYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIHhwX2Jvb3N0cyAoaWQgSU5URUdFUiBVTklRVUUsIHVuY2xhaW1lZF90aW1lX21zIElOVEVHRVIsIG11bHRpcGxpZXIgSU5URUdFUiwgb3duZXJfaWQgVEVYVCwgZW5kX3RpbWVzdGFtcCBJTlRFR0VSKWBcclxuKTtcclxuYXdhaXQgZGIuZXhlYyhcclxuICBTUUxgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgc2VydmVyX2NvbW1hbmRfY29vbGRvd25zIChuYW1lIFRFWFQsIG5leHRfYXZhaWxhYmxlX3RpbWVzdGFtcCBURVhUKWBcclxuKTtcclxuYXdhaXQgZGIuZXhlYyhcclxuICBTUUxgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgcmV3YXJkcyAobWVzc2FnZXMgSU5URUdFUiwgeHBfYm9vc3RfbXVsdGlwbGllciBJTlRFR0VSLCB4cF9ib29zdF9kdXJhdGlvbiBJTlRFR0VSLCBjdXJyZW5jeV90b19naXZlIFRFWFQsIGN1cnJlbmN5X3RvX2dpdmVfYW1vdW50IElOVEVHRVIsIHJvbGVfaWQgVEVYVClgXHJcbik7XHJcbi8vIEkgY2FuJ3QgdXNlIGFuIGFycmF5IGluIC5lbnYgZm9yIHNvbWUgcmVhc29uXHJcbmF3YWl0IGxvYWRfZGVmYXVsdF9jdXJyZW5jaWVzKGNvbmZpZy5zZXJ2ZXIuZGVmYXVsdF9jdXJyZW5jaWVzKTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGxvYWRfZGVmYXVsdF9jdXJyZW5jaWVzKFxyXG4gIGN1cnJlbmN5X25hbWVzOiBzdHJpbmdbXVxyXG4pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAvLyBBZGQgZGVmYXVsdCBjdXJyZW5jaWVzIHRvIERCXHJcbiAgZm9yIChjb25zdCBjdXJyZW5jeV9uYW1lIG9mIGN1cnJlbmN5X25hbWVzKSB7XHJcbiAgICBpZiAoIShhd2FpdCBkb2VzX2N1cnJlbmN5X2V4aXN0KGN1cnJlbmN5X25hbWUpKSkge1xyXG4gICAgICBhd2FpdCBkYi5ydW4oXHJcbiAgICAgICAgU1FMYElOU0VSVCBJTlRPIGN1cnJlbmN5X2NvbmZpZyAoY3VycmVuY3lfaWQsIGNhbl9iZV9kZWxldGVkKSBWQUxVRVMgKCR7Y3VycmVuY3lfbmFtZX0sIGZhbHNlKWBcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEl0ZXJhdGUgb3ZlciBjdXJyZW5jaWVzIGFuZCB1bm1hcmsgY3VycmVuY2llcyB0aGF0IHdlcmUgb25jZSBpbmRpY2F0ZWQgYXMgZGVmYXVsdCBidXQgYXJlIG5vIGxvbmdlciBpbmRpY2F0ZWQgYXMgZGVmYXVsdCBpbiBjb25maWdcclxuICBjb25zdCBjdXJyZW5jeV9jb25maWdzID0gYXdhaXQgZGIuYWxsKFNRTGBTRUxFQ1QgKiBGUk9NIGN1cnJlbmN5X2NvbmZpZ2ApO1xyXG4gIGZvciAobGV0IGN1cnJlbmN5X2NvbmZpZyBvZiBjdXJyZW5jeV9jb25maWdzKSB7XHJcbiAgICBpZiAoIWN1cnJlbmN5X25hbWVzLmluY2x1ZGVzKGN1cnJlbmN5X2NvbmZpZy5jdXJyZW5jeV9pZCkpXHJcbiAgICAgIGF3YWl0IGRiLnJ1bihcclxuICAgICAgICBTUUxgVVBEQVRFIGN1cnJlbmN5X2NvbmZpZyBTRVQgY2FuX2JlX2RlbGV0ZWQgPSB0cnVlIFdIRVJFIGN1cnJlbmN5X2lkID0gJHtjdXJyZW5jeV9jb25maWcuY3VycmVuY3lfaWR9YFxyXG4gICAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=