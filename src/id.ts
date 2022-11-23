let id = 0;
export function createId() {
  return `__keep_alive_${id++}`;
}
