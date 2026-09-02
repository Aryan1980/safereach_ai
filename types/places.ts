export type SafePlaceType =
  | 'police'
  | 'hospital'
  | 'transit'
  | 'commercial'
  | 'fuel_station'
  | 'hotel'
  | 'bank_atm'
  | 'pharmacy'
  | 'fire_station'
  | 'safe_haven';

export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
  address?: string;
}

export interface SafePlace {
  id: string;
  name: string;
  type: SafePlaceType;
  lat: number;
  lng: number;
  distanceKm: number;
  address?: string;
  city?: string;
  phone?: string;
  openingHours?: string;
  wheelchair?: boolean;
  operator?: string;
  is24x7?: boolean;
  securityFeature?: string;
  source: 'osm_overpass' | 'verified_emergency';
}

export interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

export type PlaceCategoryFilter =
  | 'all'
  | 'transit'
  | 'commercial'
  | 'police'
  | 'hospital'
  | 'fuel_station'
  | 'hotel'
  | 'pharmacy'
  | 'fire_station';
