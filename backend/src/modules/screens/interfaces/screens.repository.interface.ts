import { IScreen } from "./screens.model.interface";
import { 
  CreateScreenDto, 
  UpdateScreenDto, 
  ScreenFilterDto, 
  AdvancedScreenFilterDto,
  PaginatedScreenResultDto,
  ScreenStatisticsDto
} from "../dtos/dtos";
import { IBaseReadRepository, IBaseRepository, IBaseWriteRepository } from "../../../repositories/baseRepository.interface";

export interface IScreenReadRepository extends IBaseReadRepository<IScreen> {
  getScreensByTheaterId(theaterId: string): Promise<IScreen[]>;
  getScreenByIdWithTheaterDetails(screenId: string): Promise<IScreen | null>;
  getScreensByTheaterIdWithAdvancedFilters(theaterId: string, filters: AdvancedScreenFilterDto): Promise<ScreenStatisticsDto>;
  getScreenByTheaterIdAndName(theaterId: string, name: string): Promise<IScreen | null>;
  getActiveScreensByTheaterId(theaterId: string): Promise<IScreen[]>;
}

export interface IScreenWriteRepository extends IBaseWriteRepository<IScreen, string, CreateScreenDto, UpdateScreenDto> {
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
