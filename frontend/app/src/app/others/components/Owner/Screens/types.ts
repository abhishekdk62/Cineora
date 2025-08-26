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

export interface ScreenTemplate {
  name: string;
  description: string;
  icon: ReactNode;
  capacity: string;
  layout: RowDef[];
}

export interface FormData {
  name: string;
  totalSeats: number;
  features:string[];
  screenType:string;
  layout: {
    rows: number;
    seatsPerRow: number;
    advancedLayout: {
      rows: {
        rowLabel: string;
        offset: number;
        seats: Seat[];
      }[];
    };
  };
}

export interface ScreenFormModalProps {
  theater: ITheater | null;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
  initialData?: IScreen;
}

export interface ValidationErrors {
  [key: string]: string;
}
