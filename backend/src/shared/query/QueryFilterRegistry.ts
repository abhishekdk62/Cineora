/**
 * Open/Closed: register new filters without modifying build logic.
 */
export type QueryFilterFn<TValue = unknown> = (
  value: TValue
) => Record<string, unknown>;

export class QueryFilterRegistry<TFilterKey extends string> {
  private readonly _filters = new Map<TFilterKey, QueryFilterFn>();

  register<TValue>(
    key: TFilterKey,
    fn: QueryFilterFn<TValue>
  ): this {
    this._filters.set(key, fn as QueryFilterFn);
    return this;
  }

  buildQuery(
    filters: Partial<Record<TFilterKey, unknown>>
  ): Record<string, unknown> {
    const query: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === "") {
        continue;
      }

      const applyFilter = this._filters.get(key as TFilterKey);
      if (applyFilter) {
        Object.assign(query, applyFilter(value));
      }
    }

    return query;
  }
}
