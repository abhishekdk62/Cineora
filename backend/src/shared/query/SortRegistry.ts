/**
 * Open/Closed: register new sort keys without modifying sort builder.
 */
export type SortFn = (order: number) => Record<string, number>;

export class SortRegistry<TSortKey extends string> {
  private readonly _sorts = new Map<TSortKey, SortFn>();

  register(key: TSortKey, fn: SortFn): this {
    this._sorts.set(key, fn);
    return this;
  }

  buildSort(sortBy: TSortKey | undefined, sortOrder?: string): Record<string, number> {
    const order = sortOrder === "desc" ? -1 : 1;
    const sortFn = sortBy ? this._sorts.get(sortBy) : undefined;
    return sortFn ? sortFn(order) : { createdAt: -1 };
  }
}
