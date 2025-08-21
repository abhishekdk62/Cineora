import { ServiceResponse } from "../../../interfaces/interface";
import {
  CreateScreenDto,
  UpdateScreenDto,
  ScreenFilters,
  AdvancedScreenFilters,
} from "../dtos/dtos";

export interface IScreenService {
  createScreen(
    screenData: CreateScreenDto
  ): Promise<ServiceResponse>;

  deleteScreen(screenId: string): Promise<ServiceResponse>;

  deleteScreensByTheater(theaterId: string): Promise<ServiceResponse>;

  getScreensTheaterData(screenId: string): Promise<ServiceResponse>;

  getScreenById(screenId: string): Promise<ServiceResponse>;

  getScreensByTheaterId(theaterId: string): Promise<ServiceResponse>;

  getScreenStats(theaterId: string): Promise<ServiceResponse>;

  getScreensByTheaterIdWithFilters(
    theaterId: string,
    filters?: AdvancedScreenFilters
  ): Promise<ServiceResponse>;

  getAllScreens(
    page: number,
    limit: number,
    filters?: ScreenFilters
  ): Promise<ServiceResponse>;

  updateScreen(
    screenId: string,
    updateData: UpdateScreenDto
  ): Promise<ServiceResponse>;

  toggleScreenStatus(screenId: string): Promise<ServiceResponse>;

  checkScreenExists(
    name: string,
    theaterId: string,
    excludedId?: string
  ): Promise<ServiceResponse>;

  getScreenByTheaterAndName(
    theaterId: string,
    name: string
  ): Promise<ServiceResponse>;

  getActiveScreensByTheaterId(theaterId: string): Promise<ServiceResponse>;

  getScreenCountByTheaterId(theaterId: string): Promise<ServiceResponse>;
}
