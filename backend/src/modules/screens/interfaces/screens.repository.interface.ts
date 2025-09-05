import { IScreen } from "./screens.model.interface";
import { 
  CreateScreenDto, 
  UpdateScreenDto, 
  ScreenFilterDto, 
  AdvancedScreenFilterDto,
  PaginatedScreenResultDto,
  ScreenStatisticsDto
} from "../dtos/dtos";

export interface IScreenReadRepository {
  getScreenById(screenId: string): Promise<IScreen | null>;
  getScreensByTheaterId(theaterId: string): Promise<IScreen[]>;
  getAllScreensPaginated(page: number, limit: number, filters?: ScreenFilterDto): Promise<PaginatedScreenResultDto>;
  getScreenByIdWithTheaterDetails(screenId: string): Promise<IScreen | null>;
  getScreensByTheaterIdWithAdvancedFilters(theaterId: string, filters: AdvancedScreenFilterDto): Promise<ScreenStatisticsDto>;
  getScreenByTheaterIdAndName(theaterId: string, name: string): Promise<IScreen | null>;
  getActiveScreensByTheaterId(theaterId: string): Promise<IScreen[]>;
}

export interface IScreenWriteRepository {
  createScreen(screenData: CreateScreenDto): Promise<IScreen>;
  updateScreen(screenId: string, updateData: UpdateScreenDto): Promise<IScreen>;
  toggleScreenStatus(screenId: string): Promise<IScreen>;
  deleteScreen(screenId: string): Promise<IScreen>;
  deleteScreensByTheaterId(theaterId: string): Promise<number>;
}

export interface IScreenValidationRepository {
  checkScreenExistsByNameAndTheater(name: string, theaterId: string, excludedId?: string): Promise<boolean>;
}

export interface IScreenStatisticsRepository {
  countScreensByTheaterId(theaterId: string): Promise<number>;
}

export interface IScreenRepository extends 
  IScreenReadRepository, 
  IScreenWriteRepository, 
  IScreenValidationRepository, 
  IScreenStatisticsRepository {}
