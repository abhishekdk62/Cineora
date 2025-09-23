
export interface IBaseReadRepository<T, TId = string> {
  findById(id: TId): Promise<T | null>;
  findByEmail?(email: string): Promise<T | null>;
  findByPhone?(phone: string): Promise<T | null>;
  findAll(page?: number, limit?: number): Promise<{ data: T[]; total: number }>;
  findByStatus?(status: string, page?: number, limit?: number): Promise<{ data: T[]; total: number }>;
}

export interface IBaseWriteRepository<T, TId = string, TCreateDto = Partial<T>, TUpdateDto = Partial<T>> {
  create(data: TCreateDto): Promise<T>;
  update(id: TId, updateData: TUpdateDto): Promise<T | null>;
  delete(id: TId): Promise<T | null>;
  toggleStatus(id: TId): Promise<T | null>;
  updateRefreshToken?(id: TId, hashedRefreshToken: string): Promise<T | null>;
  clearRefreshToken?(id: TId): Promise<T | null>;
  updatePassword?(id: TId, hashedPassword: string): Promise<boolean>;
}
  
export interface IBaseRepository<T, TId = string, TCreateDto = Partial<T>, TUpdateDto = Partial<T>> 
  extends IBaseReadRepository<T, TId>, IBaseWriteRepository<T, TId, TCreateDto, TUpdateDto> {}
