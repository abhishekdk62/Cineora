export function getQueryString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? String(value[0]) : undefined;
  }

  if (typeof value === "object") {
    return undefined;
  }

  return String(value);
}

export function getQueryNumber(value: unknown, fallback?: number): number | undefined {
  const str = getQueryString(value);

  if (str === undefined) {
    return fallback;
  }

  const parsed = Number(str);
  return Number.isNaN(parsed) ? fallback : parsed;
}
