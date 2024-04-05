export function stringify(obj: unknown): string {
  return JSON.stringify(
    obj,
    (_key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
  );
}
