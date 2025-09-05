import { TheaterFilters, CreateTheaterDTO, UpdateTheaterDTO } from "../dtos/dto";
import { ITheater } from "./theater.model.interface";

export interface ITheaterReadRepository {
  getTheaterById(theaterId: string): Promise<ITheater | null>;
  getTheatersByOwnerId(
    ownerId: string,
    filters?: TheaterFilters
  ): Promise<{
    theaters: ITheater[];
    totalFiltered: number;
    inactiveAll: number;
    activeAll: number;
    totalAll: number;
  }>;
  getAllTheaters(
    page: number,
    limit: number,
    filters?: TheaterFilters
  ): Promise<{ theaters: ITheater[]; total: number }>;
  getTheatersByFilters(
    filters: TheaterFilters,
    page: number,
    limit: number
  ): Promise<{ theaters: ITheater[]; total: number }>;
  getNearbyTheaters(
    longitude: number,
    latitude: number,
    maxDistance: number
  ): Promise<ITheater[]>;
  theaterExistsByNameAndCity(
    name: string,
    city: string,
    state: string,
    excludeId?: string
  ): Promise<boolean>;
  getTheaterByOwnerIdAndName(
    ownerId: string,
    name: string
  ): Promise<ITheater | null>;
  getTheatersWithFilters(filters: TheaterFilters): Promise<{
    theaters: ITheater[];
    total: number;
    totalPages: number;
  }>;
}

export interface ITheaterWriteRepository {
  createTheater(
    ownerId: string,
    theaterData: CreateTheaterDTO
  ): Promise<ITheater>;
  updateTheater(
    theaterId: string,
    updateData: UpdateTheaterDTO
  ): Promise<ITheater | null>;
  deleteTheater(theaterId: string): Promise<boolean>;
  incrementTheaterScreenCount(theaterId: string): Promise<void>;
  decrementTheaterScreenCount(theaterId: string): Promise<void>;
  toggleTheaterStatus(theaterId: string): Promise<ITheater | null>;
  verifyTheater(theaterId: string): Promise<ITheater | null>;
  rejectTheater(theaterId: string): Promise<ITheater | null>;
}

export interface ITheaterRepository extends ITheaterReadRepository, ITheaterWriteRepository {}
