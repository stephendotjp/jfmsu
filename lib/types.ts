export interface Location {
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  placeId: string;
  lat: number;
  lng: number;
}

export type SortMode = 'top' | 'reviewed' | 'risky';
