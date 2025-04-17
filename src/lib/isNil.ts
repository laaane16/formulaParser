/**
 * Checks if the given value is `null` or `undefined`.
 * @param value - The value to check.
 * @returns {boolean} `true` if the value is `null` or `undefined`, `false` otherwise.
 */
export function isNil(value: unknown): boolean {
  return value == null;
}
