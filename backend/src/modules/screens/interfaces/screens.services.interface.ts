import { 
  CreateScreenDto, 
  UpdateScreenDto, 
  ScreenFilterDto, 
  AdvancedScreenFilterDto,
  ScreenStatsDto,
  ScreenExistsDto,
  ScreenCountDto,
  PaginatedScreenResultDto
} from "../dtos/dtos";
import { ServiceResponse } from "../../../interfaces/interface";
import { IScreen } from "./screens.model.interface";

export interface IScreenService {
  createScreen(screenData: CreateScreenDto): Promise<ServiceResponse<IScreen>>;
  getScreenById(screenId: string): Promise<ServiceResponse<IScreen>>;
  getScreensByTheaterId(theaterId: string): Promise<ServiceResponse<IScreen[]>>;
  getActiveScreensByTheaterId(theaterId: string): Promise<ServiceResponse<IScreen[]>>;
  getScreenWithTheaterData(screenId: string): Promise<ServiceResponse<IScreen>>;
  getAllScreensPaginated(page: number, limit: number, filters?: ScreenFilterDto): Promise<ServiceResponse<PaginatedScreenResultDto>>;
  getScreensByTheaterIdWithAdvancedFilters(theaterId: string, filters: AdvancedScreenFilterDto): Promise<ServiceResponse<any>>;
  getScreenStatisticsByTheaterId(theaterId: string): Promise<ServiceResponse<ScreenStatsDto>>;
  updateScreen(screenId: string, updateData: UpdateScreenDto): Promise<ServiceResponse<IScreen>>;
  toggleScreenStatus(screenId: string): Promise<ServiceResponse<IScreen>>;
  deleteScreen(screenId: string): Promise<ServiceResponse<void>>;
  deleteScreensByTheaterId(theaterId: string): Promise<ServiceResponse<{ deletedCount: number }>>;
  checkScreenExists(name: string, theaterId: string, excludedId?: string): Promise<ServiceResponse<ScreenExistsDto>>;
  getScreenByTheaterAndName(theaterId: string, name: string): Promise<ServiceResponse<IScreen>>;
  getScreenCountByTheaterId(theaterId: string): Promise<ServiceResponse<ScreenCountDto>>;
}
