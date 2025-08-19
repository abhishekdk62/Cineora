export interface IScreen {
  _id: string;
  theaterId:
    | string
    | {
        _id: string;
        name: string;
        city?: string;
        state?: string;
      };
  name: string;
  totalSeats: number;
  layout: {
    rows: number;
    seatsPerRow: number;
    advancedLayout: {
      rows: Array<{
        rowLabel: string;
        seats: Array<{
          id: string;       
          type: "VIP" | "Premium" | "Normal";
          price: number;
          
        }>;
        offset?: number;    
      }>;
    };
    seatMap?: any;          
  };
  screenType?: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
