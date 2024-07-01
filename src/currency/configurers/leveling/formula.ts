import config from "../../../configs/config.json" assert { type: "json" };
const { a, b } = config.server.leveling.polynomial_values;

export function xp(level: number): number {
  return a * level ** 2 + b * level;
}

export function level(xp: number): number {
  return Math.floor((-b + Math.sqrt(b ** 2 - 4 * a * -xp)) / (2 * a));
}
