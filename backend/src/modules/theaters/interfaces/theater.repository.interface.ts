import { ITheater } from "./theater.model.interface";
import { TheaterFilters } from "../dtos/dto";
import { Types } from "mongoose";

export interface ITheaterRepository {
  create(
    ownerId: string,
    theaterData: Partial<ITheater>
  ): Promise<ITheater | null>;

  findById(theaterId: string): Promise<ITheater | null>;
  findByOwnerId(
    ownerId: string,
    filters?: TheaterFilters
  ): Promise<{
    theaters: ITheater[];
    totalFiltered: number;
    inactiveAll: number;
    activeAll: number;
    totalAll: number;
  }>;

  findAll(
    page: number,
    limit: number,
    filters?: TheaterFilters
  ): Promise<{
    theaters: ITheater[];
    total: number;
  }>;

  findByFilters(
    filters: TheaterFilters,
    page: number,
    limit: number
  ): Promise<{
    theaters: ITheater[];
    total: number;
  }>;

  update(
    theaterId: string,
    updateData: Partial<ITheater>
  ): Promise<ITheater | null>;

  toggleStatus(theaterId: string): Promise<ITheater | null>;

  verifyTheater(theaterId: string): Promise<ITheater | null>;

  rejectTheater(theaterId: string): Promise<ITheater | null>;

  incrementScreenCount(theaterId: string): Promise<void>;

  decrementScreenCount(theaterId: Types.ObjectId): Promise<void>;

  getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number;

  findWithFilters(filters: TheaterFilters): Promise<{
    theaters: ITheater[];
    total: number;
    totalPages: number;
  }>;

  delete(theaterId: string): Promise<boolean>;

  findNearby(
    longitude: number,
    latitude: number,
    maxDistance: number
  ): Promise<ITheater[]>;

  existsByNameAndCity(
    name: string,
    city: string,
    state: string,
    excludeId?: string
  ): Promise<boolean>;

  findByOwnerIdAndName(ownerId: string, name: string): Promise<ITheater | null>;
}
