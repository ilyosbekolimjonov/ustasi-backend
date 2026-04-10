export function toNumber(
  value: string | number | bigint | { toString(): string },
): number {
  return Number(value.toString());
}
