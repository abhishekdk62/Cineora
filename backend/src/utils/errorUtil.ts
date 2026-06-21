export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return getErrorMessage(error);
  }
  return String(error);
}

export function getErrorStatus(error: unknown, fallback = 500): number {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status: unknown }).status === "number"
  ) {
    return (error as { status: number }).status;
  }
  return fallback;
}
