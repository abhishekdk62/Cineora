import { ITheater } from "./theater.model.interface";
import { TheaterFilters, CreateTheaterDTO, UpdateTheaterDTO } from "../dtos/dto";
import { IBaseReadRepository, IBaseRepository, IBaseWriteRepository } from "../../../repositories/baseRepository.interface";

export interface ITheaterReadRepository extends IBaseReadRepository<ITheater> {
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

export interface ITheaterWriteRepository extends IBaseWriteRepository<ITheater, string, CreateTheaterDTO, UpdateTheaterDTO> {
  createTheater(ownerId: string, theaterData: CreateTheaterDTO): Promise<ITheater>; 
  incrementTheaterScreenCount(theaterId: string): Promise<void>;
  decrementTheaterScreenCount(theaterId: string): Promise<void>;
  verifyTheater(theaterId: string): Promise<ITheater | null>;
  rejectTheater(theaterId: string): Promise<ITheater | null>;
}

export interface ITheaterRepository extends ITheaterReadRepository, ITheaterWriteRepository {}
