import { ITheater } from "./theater.model.interface";
import { TheaterFilters, CreateTheaterDTO, UpdateTheaterDTO } from "../dtos/dto";
import { IBaseReadRepository, IBaseRepository, IBaseWriteRepository } from "../../../repositories/baseRepository.interface";

export interface ITheaterReadRepository extends Omit<IBaseReadRepository<ITheater>, "findAll" | "findByStatus"> {
  findAll(
    page: number,
    limit: number,
    filters?: TheaterFilters
  ): Promise<{ data: ITheater[]; total: number }>;
  findByStatus?(
    status: string,
    page?: number,
    limit?: number
  ): Promise<{ data: ITheater[]; total: number }>;
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
  ): Promise<{ data: ITheater[]; total: number }>;
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

export interface ITheaterWriteRepository extends Omit<IBaseWriteRepository<ITheater, string, CreateTheaterDTO, UpdateTheaterDTO>, "create" | "delete"> {
  create(ownerId: string, theaterData: CreateTheaterDTO): Promise<ITheater>;
  delete(theaterId: string): Promise<boolean>;
  createTheater(ownerId: string, theaterData: CreateTheaterDTO): Promise<ITheater>; 
  incrementTheaterScreenCount(theaterId: string): Promise<void>;
  decrementTheaterScreenCount(theaterId: string): Promise<void>;
  verifyTheater(theaterId: string): Promise<ITheater | null>;
  rejectTheater(theaterId: string): Promise<ITheater | null>;
}

export interface ITheaterRepository extends ITheaterReadRepository, ITheaterWriteRepository {}
