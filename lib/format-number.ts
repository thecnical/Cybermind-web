export function compactFormat(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

export function standardFormat(value: number): string {
  return new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}
