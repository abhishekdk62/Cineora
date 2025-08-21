import { IScreen } from "./screens.model.interface";

export interface IScreenRepository {
  create(screenData: Partial<IScreen>): Promise<IScreen | null>;
  findById(screenId: string): Promise<IScreen | null>;
  findByTheaterId(theaterId: string): Promise<IScreen[]>;
  deleteMany(theaterId: string): Promise<number>;
  findAll(
    page: number,
    limit: number,
    filters?: any
  ): Promise<{ screens: IScreen[]; total: number }>;
  findByIdGetTheaterDetails(screenId: string): Promise<IScreen>;
  
  findByTheaterIdWithFilters(
    theaterId: string,
    filters?: {
      isActive?: boolean;
      screenType?: string;
      search?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ): Promise<{
    screens: IScreen[];
    totalFiltered: number;
    activeAll: number;
    inactiveAll: number;
    totalAll: number;
  }>;

  update(
    screenId: string,
    updateData: Partial<IScreen>
  ): Promise<IScreen | null>;

  toggleStatus(screenId: string): Promise<IScreen | null>;
  delete(screenId: string): Promise<IScreen>;
  existsByNameAndTheater(
    name: string,
    theaterId: string,
    excludedId?: string
  ): Promise<boolean>;
  findByTheaterIdAndName(
    theaterId: string,
    name: string
  ): Promise<IScreen | null>;
  countByTheaterId(theaterId: string): Promise<number>;
  findActiveByTheaterId(theaterId: string): Promise<IScreen[]>;
}