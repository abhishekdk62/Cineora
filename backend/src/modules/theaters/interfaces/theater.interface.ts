import mongoose, { Document } from "mongoose";

export interface ITheater extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  phone: string;
  facilities: string[];
  screens: number;
  isActive: boolean;
  isRejected: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface ServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}
export interface FindWithFiltersArgs {
  search?: string;
  sortBy?: string;
  page: number;
  limit: number;
  latitude?: number;
  longitude?: number;
}
export interface ITheaterRepository {
  create(
    ownerId: string,
    theaterData: Partial<ITheater>
  ): Promise<ITheater | null>;
  findById(theaterId: string): Promise<ITheater | null>;
  findByOwnerId(
    ownerId: string,
    filters?: any
  ): Promise<{
    theaters: ITheater[];
    totalFiltered: number;
    activeAll: number;
    inactiveAll: number;
  }>;
  findAll(
    page: number,
    limit: number,
    filters?: any
  ): Promise<{
    theaters: ITheater[];
    total: number;
  }>;
  findByFilters(
    filters: any,
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
  incrementScreenCount(theaterId: any): Promise<void>;
  decrementScreenCount(theaterId: any): Promise<void>;
  getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): any;
  findWithFilters({
    search,
    sortBy,
    page,
    limit,
    latitude,
    longitude,
  }: FindWithFiltersArgs): any;
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




export interface ITheaterService {
  createTheater(ownerId: string, theaterData: ITheater): Promise<ServiceResponse>;

  getTheaterById(theaterId: string): Promise<ServiceResponse>;

  getTheatersByOwnerId(ownerId: string, filters?: any): Promise<ServiceResponse>;

  getAllTheaters(page: number, limit: number, filters?: any): Promise<ServiceResponse>;

  updateTheater(
    theaterId: string,
    updateData: Partial<ITheater>
  ): Promise<ServiceResponse>;

  toggleTheaterStatus(theaterId: string): Promise<ServiceResponse>;

  verifyTheater(theaterId: string): Promise<ServiceResponse>;

  rejectTheater(theaterId: string, rejectionReason?: string): Promise<ServiceResponse>;

  deleteTheater(theaterId: string): Promise<ServiceResponse>;

  getNearbyTheaters(
    longitude: number,
    latitude: number,
    maxDistance: number
  ): Promise<ServiceResponse>;

  checkTheaterExists(
    name: string,
    city: string,
    state: string,
    excludeId?: string
  ): Promise<ServiceResponse>;

  getTheatersWithFilters(filters: any): Promise<{
    theaters: ITheater[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>;

  getTheaterByOwnerAndName(ownerId: string, name: string): Promise<ServiceResponse>;
}