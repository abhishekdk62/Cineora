import { ITheater } from ".";

export interface IScreen {
  _id: string;
  theaterId: string;
  name: string;
  totalSeats: number;
  features: string[];
  screenType: string;
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
      aisles?: {
        vertical: {
          id: string;
          position: number; 
          width: number; 
          type: 'main' | 'side' | 'emergency';
          label?: string; 
        }[];
        horizontal: {
          id: string;
          afterRow: number; 
          width: number; 
          type: 'cross' | 'emergency';
          label?: string; 
        }[];
      };
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAisleFormData {
  vertical: {
    id: string;
    position: string; 
    width: string; 
    type: 'main' | 'side' | 'emergency';
    label?: string;
  }[];
  horizontal: {
    id: string;
    afterRow: string; 
    width: string; 
    type: 'cross' | 'emergency';
    label?: string;
  }[];
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
    aisles?: IAisleFormData;
  };
  isActive: boolean;
}

export interface IScreenResponse {
  success: boolean;
  message: string;
  data?: IScreen;
}

export interface IScreenFilters {
  isActive?: boolean;
  screenType?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  hasAisles?: boolean;
}

export interface IScreenLayoutFormData {
  rows: string;
  seatsPerRow: string;
  totalSeats: string;
  aisles?: IAisleFormData;
}

export interface IFormErrors {
  name?: string;
  totalSeats?: string;
  rows?: string;
  seatsPerRow?: string;
  submit?: string;
  aisles?: {
    vertical?: { [key: string]: string }; 
    horizontal?: { [key: string]: string }; 
    general?: string; 
  };
}

export interface IScreenFormModalProps {
  theater: ITheater;
  onClose: () => void;
  onSuccess: (screen: IScreen) => void;
  mode: 'edit' | 'create';
  initialData: IScreen | null;
}

export interface IAisleConfigModalProps {
  screen: IScreen;
  theater: ITheater | null;
  onClose: () => void;
  onSuccess: () => void;
}

export interface IAisleValidation {
  isValid: boolean;
  errors: {
    vertical: { [aisleId: string]: string };
    horizontal: { [aisleId: string]: string };
    conflicts: string[];
  };
}

export interface IAisleStats {
  totalVerticalAisles: number;
  totalHorizontalAisles: number;
  mainAisles: number;
  emergencyAisles: number;
  totalAisleWidth: number; 
  effectiveSeatingArea: number; 
}
