import * as Discord from "discord.js";
import { get_store_item } from "../currency/operations/storeitems.js";
import { client } from "../startup/client.js";
import { automod } from "../util/automod.js";
import {
  get_currency_balance,
  add_currency,
} from "../currency/operations/arithmetic.js";
import config from "../configs/config.json" assert { type: "json" };

interface BuyerData {
  buyer: Discord.User;
  item_name: string;
  gift_anonymously?: boolean;
  gift_receiver?: Discord.User;
  gift_message?: string;
}

export async function buy_item(data: BuyerData) {
  const item = await get_store_item(data.item_name);
  if (!item) throw new Error("This item doesn't exist!");
  const user_balance = await get_currency_balance(
    data.buyer.id,
    item.currency_required
  );
  if (data.gift_message) {
    if (automod.scanners.contains_bad_words(data.gift_message))
      throw new Error("You can't send a gift with bad words!");
  }
  if (user_balance < item.price) throw new Error("You can't afford this item!");

  await add_currency(
    data.buyer.id,
    item.currency_required,
    -item.price,
    "Store item purchase"
  );

  const recipient_user = data.gift_receiver ?? data.buyer;
  const recipient = client.guilds
    .resolve(config.server.id)
    .members.resolve(recipient_user);
  if (
    !item.currency_to_give &&
    !item.currency_to_give_amount &&
    recipient.roles.cache.has(item.role_to_give)
  )
    throw new Error("The recipient already has this role!");

  if (item.role_to_give) recipient.roles.add(item.role_to_give);
  if (item.role_duration)
    setTimeout(
      () => recipient.roles.remove(item.role_to_give),
      item.role_duration
    );
  if (item.currency_to_give && item.currency_to_give_amount)
    await add_currency(
      recipient.id,
      item.currency_to_give,
      item.currency_to_give_amount,
      "Currency from store item purchase"
    );
  if (data.gift_message)
    recipient
      .send(
        `# ${
          data.gift_anonymously ? "Someone anyonymously" : `<@${data.buyer.id}>`
        } gifted you in Prismatic! 
▸ Item sent to you: \`${item.item_name}\` 
${data.gift_message ? `▸ Gift message: ${data.gift_message}` : ""}
▸ [Go check it out](https://discord.gg/friendships)`
      )
      .catch((err) => {});
}
