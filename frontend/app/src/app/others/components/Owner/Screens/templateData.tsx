import React from 'react';
import { HomeIcon, Castle, TvMinimal, Gem, Star, Clapperboard } from 'lucide-react';
import { ScreenTemplate } from './types';

export const screenTemplates: ScreenTemplate[] = [
  {
    name: "Cozy Cinema",
    description: "Perfect for intimate screenings and art house films",
    icon: <Clapperboard />,
    capacity: "120-180 seats",
    layout: [
      { rowLabel: 'A', seatCount: 12, offset: 2, type: 'Normal', price: 120 },
      { rowLabel: 'B', seatCount: 14, offset: 1, type: 'Normal', price: 120 },
      { rowLabel: 'C', seatCount: 16, offset: 0, type: 'Normal', price: 140 },
      { rowLabel: 'D', seatCount: 16, offset: 0, type: 'Premium', price: 180 },
      { rowLabel: 'E', seatCount: 14, offset: 1, type: 'Premium', price: 200 },
    ]
  },
  {
    name: "Grand Auditorium",
    description: "Classic theater experience with premium amenities",
    icon: <HomeIcon />,
    capacity: "280-350 seats",
    layout: [
      { rowLabel: 'A', seatCount: 16, offset: 3, type: 'Normal', price: 150 },
      { rowLabel: 'B', seatCount: 18, offset: 2, type: 'Normal', price: 150 },
      { rowLabel: 'C', seatCount: 20, offset: 1, type: 'Normal', price: 170 },
      { rowLabel: 'D', seatCount: 22, offset: 0, type: 'Premium', price: 200 },
      { rowLabel: 'E', seatCount: 22, offset: 0, type: 'Premium', price: 220 },
      { rowLabel: 'F', seatCount: 20, offset: 1, type: 'VIP', price: 300 },
      { rowLabel: 'G', seatCount: 18, offset: 2, type: 'VIP', price: 320 },
    ]
  },
  {
    name: "Mega Multiplex",
    description: "Large-scale entertainment with luxury seating",
    icon: <Castle />,
    capacity: "450-600 seats",
    layout: [
      { rowLabel: 'A', seatCount: 20, offset: 4, type: 'Normal', price: 180 },
      { rowLabel: 'B', seatCount: 22, offset: 3, type: 'Normal', price: 180 },
      { rowLabel: 'C', seatCount: 24, offset: 2, type: 'Normal', price: 200 },
      { rowLabel: 'D', seatCount: 26, offset: 1, type: 'Premium', price: 250 },
      { rowLabel: 'E', seatCount: 28, offset: 0, type: 'Premium', price: 280 },
      { rowLabel: 'F', seatCount: 28, offset: 0, type: 'Premium', price: 280 },
      { rowLabel: 'G', seatCount: 26, offset: 1, type: 'VIP', price: 400 },
      { rowLabel: 'H', seatCount: 24, offset: 2, type: 'VIP', price: 450 },
      { rowLabel: 'I', seatCount: 20, offset: 4, type: 'VIP', price: 500 },
    ]
  },
  {
    name: "CinemaScope Elite",
    description: "Premium wide-screen experience with curved seating",
    icon: <TvMinimal />,
    capacity: "320-420 seats",
    layout: [
      { rowLabel: 'A', seatCount: 14, offset: 5, type: 'Normal', price: 300 },
      { rowLabel: 'B', seatCount: 16, offset: 4, type: 'Normal', price: 320 },
      { rowLabel: 'C', seatCount: 18, offset: 3, type: 'Normal', price: 340 },
      { rowLabel: 'D', seatCount: 20, offset: 2, type: 'Premium', price: 400 },
      { rowLabel: 'E', seatCount: 22, offset: 1, type: 'Premium', price: 450 },
      { rowLabel: 'F', seatCount: 24, offset: 0, type: 'Premium', price: 500 },
      { rowLabel: 'G', seatCount: 22, offset: 1, type: 'VIP', price: 600 },
      { rowLabel: 'H', seatCount: 20, offset: 2, type: 'VIP', price: 650 },
    ]
  },
  {
    name: "Platinum Lounge",
    description: "Ultra-luxury recliner experience with premium service",
    icon: <Gem />,
    capacity: "60-100 seats",
    layout: [
      { rowLabel: 'A', seatCount: 8, offset: 2, type: 'VIP', price: 800 },
      { rowLabel: 'B', seatCount: 10, offset: 1, type: 'VIP', price: 750 },
      { rowLabel: 'C', seatCount: 12, offset: 0, type: 'VIP', price: 700 },
      { rowLabel: 'D', seatCount: 12, offset: 0, type: 'VIP', price: 650 },
      { rowLabel: 'E', seatCount: 10, offset: 1, type: 'VIP', price: 600 },
    ]
  },
  {
    name: "Open Air Theater",
    description: "Spacious outdoor-style seating with wide aisles",
    icon: <Star />,
    capacity: "180-240 seats",
    layout: [
      { rowLabel: 'A', seatCount: 12, offset: 2, type: 'Normal', price: 200 },
      { rowLabel: 'B', seatCount: 14, offset: 1, type: 'Normal', price: 200 },
      { rowLabel: 'C', seatCount: 16, offset: 0, type: 'Normal', price: 220 },
      { rowLabel: 'D', seatCount: 16, offset: 0, type: 'Premium', price: 280 },
      { rowLabel: 'E', seatCount: 14, offset: 1, type: 'Premium', price: 300 },
      { rowLabel: 'F', seatCount: 12, offset: 2, type: 'VIP', price: 400 },
    ]
  }
];
