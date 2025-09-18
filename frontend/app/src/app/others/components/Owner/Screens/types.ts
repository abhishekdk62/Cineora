// @ts-nocheck

import { ReactNode } from 'react';
import { ITheater } from '@/app/others/types';
import { IScreen } from '@/app/others/types/screen.types';

export interface Seat {
  col: number;
  id: string;
  type: string;
  price: number;
}

export interface RowDef {
  rowLabel: string;
  seatCount: number;
  offset: number;
  type: string;
  price: number;
}

// SIMPLIFIED: Minimal aisle interfaces
export interface VerticalAisle {
  id: string;
  position: number;
  width: number;
}

export interface HorizontalAisle {
  id: string;
  afterRow: number;
  width: number;
}

export interface ScreenTemplate {
  name: string;
  description: string;
  icon: ReactNode;
  capacity: string;
  layout: RowDef[];
  // ADD THIS: aisles property for templates
  aisles?: {
    vertical: VerticalAisle[];
    horizontal: HorizontalAisle[];
  };
}

export interface FormData {
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
        seats: Seat[];
      }[];
      // Aisle configuration
      aisles?: {
        vertical: VerticalAisle[];
        horizontal: HorizontalAisle[];
      };
    };
  };
}

export interface ScreenFormModalProps {
  theater: ITheater | null;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
  initialData?: IScreen | null; // FIXED: Allow null
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface AisleConfigurationProps {
  verticalAisles: VerticalAisle[];
  horizontalAisles: HorizontalAisle[];
  setVerticalAisles: React.Dispatch<React.SetStateAction<VerticalAisle[]>>;
  setHorizontalAisles: React.Dispatch<React.SetStateAction<HorizontalAisle[]>>;
  maxSeatsPerRow: number;
  maxRows: number;
}

export interface ManualSetupFormProps {
  formData: FormData;
  errors: ValidationErrors;
  rowsDefs: RowDef[];
  setRowsDefs: React.Dispatch<React.SetStateAction<RowDef[]>>;
  maxCols: number;
  advancedLayoutJSON: string;
  handleInputChange: (field: string, value: string | number | string[]) => void; 
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isFormValid: () => boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  setSetupMode: (mode: 'quickstart' | 'manual') => void;
  // Aisle props
  verticalAisles: VerticalAisle[];
  horizontalAisles: HorizontalAisle[];
  setVerticalAisles: React.Dispatch<React.SetStateAction<VerticalAisle[]>>;
  setHorizontalAisles: React.Dispatch<React.SetStateAction<HorizontalAisle[]>>;
}
