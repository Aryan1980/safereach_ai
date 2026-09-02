import { Coordinates, NominatimResult } from '@/types/places';

/**
 * Searches for places/cities/neighborhoods worldwide via OpenStreetMap Nominatim API
 */
export async function searchLocations(query: string): Promise<NominatimResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const encoded = encodeURIComponent(query.trim());
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&addressdetails=1&limit=6`;

    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'SafeReachAI-SafetyPlatform/1.0',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`Nominatim HTTP error ${res.status}`);
    }

    const data: NominatimResult[] = await res.json();
    return data;
  } catch (err) {
    console.warn('Geocoding search failed:', err);
    return [];
  }
}

/**
 * Reverse geocodes coordinates to get human-readable location description
 */
export async function reverseGeocode(coords: Coordinates): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'SafeReachAI-SafetyPlatform/1.0',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.display_name || null;
  } catch (err) {
    console.warn('Reverse geocoding failed:', err);
    return null;
  }
}
