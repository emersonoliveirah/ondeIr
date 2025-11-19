// Tipos compartilhados para o projeto

export interface Place {
  name: string;
  address: string;
  rating: number | null;
  phone?: string;
  website?: string;
  distance?: number; // em metros
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface SearchResult {
  query: string;
  intent: string;
  results: Place[];
  location?: Location;
}

