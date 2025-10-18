// interfaces/itinerary.interface.ts
export interface ItineraryRequest {
  city: string;
  state: string;
  duration: number; // em dias
  interests?: string[];
  budget?: 'economico' | 'moderado' | 'luxo';
}

export interface Place {
  name: string;
  description: string;
  imageUrl: string;
  visitDuration: string;
  bestTime: string;
  cost?: string;
  category: 'cultural' | 'natureza' | 'gastronomia' | 'compras' | 'entretenimento';
}

export interface DayItinerary {
  day: number;
  title: string;
  places: Place[];
}

export interface ItineraryResponse {
  city: string;
  state: string;
  summary: string;
  days: DayItinerary[];
  tips: string[];
}