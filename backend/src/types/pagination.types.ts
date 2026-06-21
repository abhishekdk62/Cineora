/** Standard paginated result — all repositories extending base read interfaces must use this shape (LSP). */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface ExtendedPaginatedResult<T> extends PaginatedResult<T> {
  totalPages: number;
}
