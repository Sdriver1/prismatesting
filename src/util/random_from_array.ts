export function random_from_array(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}
