import { IDateRange } from "../modules/adminAnalytics/dtos/dtos";

export function getDateRangeBounds(
  dateRange?: IDateRange
): { start: Date; end: Date } | undefined {
  if (!dateRange) {
    return undefined;
  }

  const start = dateRange.startDate ?? dateRange.start;
  const end = dateRange.endDate ?? dateRange.end;

  if (!start || !end) {
    return undefined;
  }

  return {
    start: start instanceof Date ? start : new Date(start),
    end: end instanceof Date ? end : new Date(end),
  };
}

export function parseDateRangeFromQuery(query: {
  startDate?: unknown;
  endDate?: unknown;
  start?: unknown;
  end?: unknown;
}): IDateRange | undefined {
  const startRaw = query.startDate ?? query.start;
  const endRaw = query.endDate ?? query.end;

  if (!startRaw || !endRaw) {
    return undefined;
  }

  const startDate = new Date(String(startRaw));
  const endDate = new Date(String(endRaw));

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return undefined;
  }

  return { startDate, endDate, start: startDate, end: endDate };
}
