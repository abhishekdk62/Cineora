import {
  CreateTheaterDto,
  UpdateTheaterDto,
  TheaterFilters,
  TheaterResponseDto,
  TheatersByOwnerDto,
  PaginatedTheatersDto,
} from "../dtos/dto";
import { ServiceResponse } from "../../../interfaces/interface";

export interface ITheaterService {
  createTheater(
    ownerId: string,
    theaterData: CreateTheaterDto
  ): Promise<ServiceResponse>;

  getTheaterById(
    theaterId: string
  ): Promise<ServiceResponse<TheaterResponseDto>>;

  getTheatersByOwnerId(
    ownerId: string,
    filters?: TheaterFilters
  ): Promise<ServiceResponse<TheatersByOwnerDto>>;

  getAllTheaters(
    page: number,
    limit: number,
    filters?: TheaterFilters
  ): Promise<ServiceResponse>;

  updateTheater(
    theaterId: string,
    updateData: UpdateTheaterDto
  ): Promise<ServiceResponse<TheaterResponseDto>>;

  toggleTheaterStatus(
    theaterId: string
  ): Promise<ServiceResponse<TheaterResponseDto>>;

  verifyTheater(
    theaterId: string
  ): Promise<ServiceResponse<TheaterResponseDto>>;

  rejectTheater(
    theaterId: string,
    rejectionReason?: string
  ): Promise<ServiceResponse<{ deleted: boolean }>>;

  deleteTheater(
    theaterId: string
  ): Promise<ServiceResponse<void>>;

  getNearbyTheaters(
    longitude: number,
    latitude: number,
    maxDistance: number
  ): Promise<ServiceResponse<TheaterResponseDto[]>>;


  getTheatersWithFilters(
    filters: TheaterFilters
  ): Promise<PaginatedTheatersDto>;

  getTheaterByOwnerAndName(
    ownerId: string,
    name: string
  ): Promise<ServiceResponse<TheaterResponseDto>>;
}
