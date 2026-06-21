import {
  CreateTheaterDTO as CreateTheaterDto,
  UpdateTheaterDTO as UpdateTheaterDto,
  TheaterFilters,
  TheatersByOwnerDto,
} from "../dtos/dto";
import { ITheater } from "./theater.model.interface";
import { ServiceResponse } from "../../../interfaces/interface";

export interface ITheaterService {
  createTheater(
    ownerId: string,
    theaterData: CreateTheaterDto
  ): Promise<ServiceResponse<ITheater>>;

  getTheaterById(
    theaterId: string
  ): Promise<ServiceResponse<ITheater>>;

  getTheatersByOwnerId(
    ownerId: string,
    filters?: TheaterFilters
  ): Promise<ServiceResponse<TheatersByOwnerDto>>;

  getAllTheaters(
    page: number,
    limit: number,
    filters?: TheaterFilters
  ): Promise<ServiceResponse<{ theaters: ITheater[]; total: number }>>;

  updateTheater(
    theaterId: string,
    updateData: UpdateTheaterDto
  ): Promise<ServiceResponse<ITheater>>;

  toggleTheaterStatus(
    theaterId: string
  ): Promise<ServiceResponse<ITheater>>;

  verifyTheater(
    theaterId: string
  ): Promise<ServiceResponse<ITheater>>;

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
  ): Promise<ServiceResponse<ITheater[]>>;

  getTheatersWithFilters(
    filters: TheaterFilters
  ): Promise<{
    theaters: ITheater[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>;

  getTheaterByOwnerAndName(
    ownerId: string,
    name: string
  ): Promise<ServiceResponse<ITheater>>;
}
