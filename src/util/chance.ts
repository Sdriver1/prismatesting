// Given a probability from 0 to 1, return true if the chance succeeded and false if it failed

export function chance(probability: number) {
  if (Math.random() > probability) return false;
  return true;
}
