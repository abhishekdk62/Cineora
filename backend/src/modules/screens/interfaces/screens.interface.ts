import { Document,Types } from "mongoose";

export interface IScreen extends Document {
  theaterId: Types.ObjectId;
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
  theaterId: Types.ObjectId;
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
  findAll(
    page: number,
    limit: number,
    filters?: any
  ): Promise<{ screens: IScreen[]; total: number }>;

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
  delete(screenId: string): Promise<boolean>;
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
