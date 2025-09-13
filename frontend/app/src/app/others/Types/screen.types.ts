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
      // ADD THIS: Aisle configuration
      aisles?: {
        vertical: {
          id: string;
          position: number; // Column position where aisle starts
          width: number; // Width in grid units (1-2)
          type: 'main' | 'side' | 'emergency';
          label?: string; // Optional label for the aisle
        }[];
        horizontal: {
          id: string;
          afterRow: number; // Row index after which aisle appears
          width: number; // Height in grid units (1-2)
          type: 'cross' | 'emergency';
          label?: string; // Optional label for the aisle
        }[];
      };
    };
    seatMap?: any;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ADD THIS: New interface for aisle form data
export interface IAisleFormData {
  vertical: {
    id: string;
    position: string; // String for form input
    width: string; // String for form input
    type: 'main' | 'side' | 'emergency';
    label?: string;
  }[];
  horizontal: {
    id: string;
    afterRow: string; // String for form input
    width: string; // String for form input
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
    // ADD THIS: Optional aisle configuration in form
    aisles?: IAisleFormData;
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
  // ADD THIS: Filter by aisle configuration
  hasAisles?: boolean;
}

export interface IScreenLayoutFormData {
  rows: string;
  seatsPerRow: string;
  totalSeats: string;
  // ADD THIS: Aisle configuration in layout form
  aisles?: IAisleFormData;
}

export interface IFormErrors {
  name?: string;
  totalSeats?: string;
  rows?: string;
  seatsPerRow?: string;
  submit?: string;
  // ADD THIS: Aisle-related validation errors
  aisles?: {
    vertical?: { [key: string]: string }; // Indexed by aisle id
    horizontal?: { [key: string]: string }; // Indexed by aisle id
    general?: string; // General aisle configuration errors
  };
}

export interface IScreenFormModalProps {
  theater: ITheater;
  onClose: () => void;
  onSuccess: (screen: IScreen) => void;
  mode: 'edit' | 'create';
  initialData: IScreen | null;
}

// ADD THIS: New interface for aisle configuration modal
export interface IAisleConfigModalProps {
  screen: IScreen;
  theater: ITheater | null;
  onClose: () => void;
  onSuccess: () => void;
}

// ADD THIS: Interface for aisle validation
export interface IAisleValidation {
  isValid: boolean;
  errors: {
    vertical: { [aisleId: string]: string };
    horizontal: { [aisleId: string]: string };
    conflicts: string[];
  };
}

// ADD THIS: Helper interface for aisle statistics
export interface IAisleStats {
  totalVerticalAisles: number;
  totalHorizontalAisles: number;
  mainAisles: number;
  emergencyAisles: number;
  totalAisleWidth: number; // Total space occupied by aisles
  effectiveSeatingArea: number; // Remaining space after aisles
}
