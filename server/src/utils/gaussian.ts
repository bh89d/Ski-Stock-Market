export function gaussian() {
  let u = 0, v = 0;

  // Avoid 0 because log(0) is undefined
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}