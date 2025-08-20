import { Document, Types } from "mongoose";
import { ServiceResponse } from "../../user/interfaces/user.interface";

export interface IScreen extends Document {
  theaterId: Types.ObjectId | { name: string; isActive: boolean;_id:string };
  name: string;
  totalSeats: number;
  layout: {
    rows: number;
    seatsPerRow: number;
    advancedLayout: {
      rows: {
        rowLabel: string;
        offset: number;
        seats: {
          col: number;
          id: string;
          type: string;
          price: number;
        }[];
      }[];
    };
    seatMap?: any; // Keep for backward compatibility
  };
  screenType?: string; // Made optional since it's not in frontend
  features?: string[]; // Made optional since it's not in frontend
  isActive: boolean;
  createdAt?: Date; // Added from frontend interface
  updatedAt?: Date; // Added from frontend interface
}
export interface IScreenInput {
  theaterId: Types.ObjectId ;
  name: string;
  totalSeats: number;
  layout: {
    rows: number;
    seatsPerRow: number;
    advancedLayout: {
      rows: {
        rowLabel: string;
        offset: number;
        seats: {
          col: number;
          id: string;
          type: string;
          price: number;
        }[];
      }[];
    };
    seatMap?: any;
  };
  isActive: boolean;
}


export interface IScreenRepository {
  create(screenData: Partial<IScreen>): Promise<IScreen | null>;
  findById(screenId: string): Promise<IScreen | null>;
  findByTheaterId(theaterId: string): Promise<IScreen[]>;
  deleteMany(theaterId: string): Promise<number>;
  findAll(
    page: number,
    limit: number,
    filters?: any
  ): Promise<{ screens: IScreen[]; total: number }>;
  findByIdGetTheaterDetails(screenId: string): Promise<IScreen>;
  
  findByTheaterIdWithFilters(
    theaterId: string,
    filters?: {
      isActive?: boolean;
      screenType?: string;
      search?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ): Promise<{
    screens: IScreen[];
    totalFiltered: number;
    activeAll: number;
    inactiveAll: number;
    totalAll: number;
  }>;

  update(
    screenId: string,
    updateData: Partial<IScreen>
  ): Promise<IScreen | null>;

  toggleStatus(screenId: string): Promise<IScreen | null>;
  delete(screenId: string): Promise<IScreen>;
  existsByNameAndTheater(
    name: string,
    theaterId: string,
    excludedId?: string
  ): Promise<boolean>;
  findByTheaterIdAndName(
    theaterId: string,
    name: string
  ): Promise<IScreen | null>;
  countByTheaterId(theaterId: string): Promise<number>;
  findActiveByTheaterId(theaterId: string): Promise<IScreen[]>;
}


export interface IScreenService {
  createScreen(
    screenData: IScreen & { theater: { _id: Types.ObjectId } }
  ): Promise<ServiceResponse>;

  deleteScreen(screenId: string): Promise<ServiceResponse>;

  deleteScreensByTheater(theaterId: string): Promise<ServiceResponse>;

  getScreensTheaterData(screenId: string): Promise<ServiceResponse>;

  getScreenById(screenId: string): Promise<ServiceResponse>;

  getScreensByTheaterId(theaterId: string): Promise<ServiceResponse>;

  getScreenStats(theaterId: string): Promise<ServiceResponse>;

  getScreensByTheaterIdWithFilters(
    theaterId: string,
    filters?: any
  ): Promise<ServiceResponse>;

  getAllScreens(
    page: number,
    limit: number,
    filters?: any
  ): Promise<ServiceResponse>;

  updateScreen(
    screenId: string,
    updateData: Partial<IScreen>
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
