export interface ISeatBlock {
  seatId: string;
  userId: string;
  sessionId: string;
  blockedAt: Date;
  expiresAt: Date;
}

export interface IRowPricing {
  rowLabel: string;
  seatType: "VIP" | "Premium" | "Normal";
  basePrice: number;
  showtimePrice: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: string[];
}

export interface IMovieShowtime {
  _id: string;
  movieId: any; // Populate with movie details
  theaterId: any; // Populate with theater details  
  screenId: any; // Populate with screen details
  showDate: Date;
  showTime: string;
  endTime: string;
  format: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos";
  language: string;
  rowPricing: IRowPricing[];
  totalSeats: number;
  availableSeats: number;
  ageRestriction:number|null;
  bookedSeats: string[];
  blockedSeats: ISeatBlock[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShowtime extends IMovieShowtime {}
