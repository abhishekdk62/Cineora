import { ITheater } from ".";

export interface IScreen {
  _id: string;
  theaterId: string;
  name: string;
  totalSeats: number;
  features:string[]
screenType:string;
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
  createdAt: Date;
  updatedAt: Date;
}



export interface IScreenFormData {
  name: string;
  totalSeats: string;
  screenType: string;
  features: string[];
  layout: {
    rows: string;
    seatsPerRow: string;
    totalSeats: string;
  };
  isActive: boolean;
}

export interface IScreenResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface IScreenFilters {
  isActive?: boolean;
  screenType?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}


export interface IScreenLayoutFormData {
  rows: string;
  seatsPerRow: string;
  totalSeats: string;
}

// interface ScreenFormData {
//   name: string;
//   totalSeats: string;
//   screenType: string;
//   features: string[];
//   layout: ScreenLayoutFormData;
//   isActive: boolean;
// }

export interface IFormErrors {
  name?: string;
  totalSeats?: string;
  rows?: string;
  seatsPerRow?: string;
  submit?: string;
}

export interface IScreenFormModalProps {
  theater: ITheater;
  onClose: () => void;
  onSuccess: (screen: IScreen) => void; 
  mode: 'edit' | 'create';
  initialData: IScreen | null;
}
