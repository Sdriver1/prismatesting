import config from "../configs/config.json" assert { type: "json" };
import { random_from_array } from "./random_from_array.js";

export function random_embed_color() {
  return random_from_array(config.bot.embed_colors);
}
