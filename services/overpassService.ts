import { Coordinates, SafePlace, SafePlaceType } from '@/types/places';
import { calculateSafeScore } from './safetyScoring';

/**
 * Calculates accurate geodesic distance in Kilometers between two coordinates using the Haversine formula.
 * @param lat1 Latitude of point 1 in degrees (-90 to +90)
 * @param lon1 Longitude of point 1 in degrees (-180 to +180)
 * @param lat2 Latitude of point 2 in degrees (-90 to +90)
 * @param lon2 Longitude of point 2 in degrees (-180 to +180)
 * @returns Geodesic distance in kilometers rounded to two decimal places
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (
    typeof lat1 !== 'number' || isNaN(lat1) ||
    typeof lon1 !== 'number' || isNaN(lon1) ||
    typeof lat2 !== 'number' || isNaN(lat2) ||
    typeof lon2 !== 'number' || isNaN(lon2)
  ) {
    return 0;
  }

  // Ensure coordinates are within valid geographic bounds
  if (lat1 < -90 || lat1 > 90 || lat2 < -90 || lat2 > 90 || lon1 < -180 || lon1 > 180 || lon2 < -180 || lon2 > 180) {
    return 0;
  }

  const R = 6371; // Earth's mean radius in km
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLon = (lon2 - lon1) * toRad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Round to 2 decimal places (e.g. 0.35 km, 1.24 km)
  return Math.round(distance * 100) / 100;
}

const OVERPASS_ENDPOINTS = [
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: {
    name?: string;
    'name:en'?: string;
    amenity?: string;
    railway?: string;
    station?: string;
    shop?: string;
    tourism?: string;
    healthcare?: string;
    emergency?: string;
    government?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:suburb'?: string;
    'addr:city'?: string;
    'addr:full'?: string;
    phone?: string;
    'contact:phone'?: string;
    'opening_hours'?: string;
    wheelchair?: string;
    operator?: string;
    [key: string]: string | undefined;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

/**
 * Builds resilient Overpass QL query covering metropolitan and suburban locations
 */
function buildOverpassQuery(lat: number, lng: number, radiusMeters: number): string {
  return `
    [out:json][timeout:25];
    (
      node["amenity"="police"](around:${radiusMeters},${lat},${lng});
      way["amenity"="police"](around:${radiusMeters},${lat},${lng});
      node["amenity"="police_booth"](around:${radiusMeters},${lat},${lng});
      node["government"="public_safety"](around:${radiusMeters},${lat},${lng});
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
      way["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
      node["amenity"="doctors"](around:${radiusMeters},${lat},${lng});
      node["healthcare"="hospital"](around:${radiusMeters},${lat},${lng});
      way["healthcare"="hospital"](around:${radiusMeters},${lat},${lng});
      node["healthcare"="clinic"](around:${radiusMeters},${lat},${lng});
      node["railway"="station"](around:${radiusMeters},${lat},${lng});
      way["railway"="station"](around:${radiusMeters},${lat},${lng});
      node["station"="subway"](around:${radiusMeters},${lat},${lng});
      node["railway"="subway_entrance"](around:${radiusMeters},${lat},${lng});
      node["amenity"="bus_station"](around:${radiusMeters},${lat},${lng});
      way["amenity"="bus_station"](around:${radiusMeters},${lat},${lng});
      node["shop"="mall"](around:${radiusMeters},${lat},${lng});
      way["shop"="mall"](around:${radiusMeters},${lat},${lng});
      node["shop"="department_store"](around:${radiusMeters},${lat},${lng});
      way["shop"="department_store"](around:${radiusMeters},${lat},${lng});
      node["shop"="supermarket"](around:${radiusMeters},${lat},${lng});
      way["shop"="supermarket"](around:${radiusMeters},${lat},${lng});
      node["amenity"="fuel"](around:${radiusMeters},${lat},${lng});
      way["amenity"="fuel"](around:${radiusMeters},${lat},${lng});
      node["tourism"="hotel"](around:${radiusMeters},${lat},${lng});
      way["tourism"="hotel"](around:${radiusMeters},${lat},${lng});
      node["amenity"="bank"](around:${radiusMeters},${lat},${lng});
      way["amenity"="bank"](around:${radiusMeters},${lat},${lng});
      node["amenity"="atm"](around:${radiusMeters},${lat},${lng});
      node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lng});
      way["amenity"="pharmacy"](around:${radiusMeters},${lat},${lng});
      node["healthcare"="pharmacy"](around:${radiusMeters},${lat},${lng});
      node["amenity"="fire_station"](around:${radiusMeters},${lat},${lng});
      way["amenity"="fire_station"](around:${radiusMeters},${lat},${lng});
    );
    out center 150 tags;
  `;
}

/**
 * Queries OpenStreetMap Overpass API for real-world safe havens.
 * Accurately calculates geodesic distances and safe scores relative to the user's coordinates.
 */
export async function fetchNearbySafePlaces(coords: Coordinates, radiusMeters: number = 5000): Promise<SafePlace[]> {
  const { lat, lng } = coords;

  // Strict coordinate validation
  if (
    typeof lat !== 'number' || isNaN(lat) || lat < -90 || lat > 90 ||
    typeof lng !== 'number' || isNaN(lng) || lng < -180 || lng > 180
  ) {
    console.error('Invalid coordinates passed to fetchNearbySafePlaces:', coords);
    return [];
  }

  const requestedRadiusKm = radiusMeters / 1000;

  // 1. First attempt at requested radius
  let places = await executeQueryWithFallback(lat, lng, radiusMeters, requestedRadiusKm);

  // 2. Adaptive radius expansion ONLY if 0 places found and initial radius was small (< 8km)
  if (places.length === 0 && radiusMeters < 8000) {
    const fallbackRadiusMeters = 8000;
    places = await executeQueryWithFallback(lat, lng, fallbackRadiusMeters, 8.0);
  }

  // Count nearby emergency anchors (police / hospital) to enhance coverage score
  const emergencyCount = places.filter((p) => p.type === 'police' || p.type === 'hospital').length;

  // Calculate dynamic Safe Score for each location using the exact same coordinates and distance
  const scoredPlaces = places.map((place) => ({
    ...place,
    safeScore: calculateSafeScore(place, emergencyCount),
  }));

  // Sort strictly by distance ascending so the nearest safe haven is always first
  return scoredPlaces.sort((a, b) => a.distanceKm - b.distanceKm);
}

async function executeQueryWithFallback(
  lat: number,
  lng: number,
  radiusMeters: number,
  maxAllowedRadiusKm: number
): Promise<SafePlace[]> {
  const query = buildOverpassQuery(lat, lng, radiusMeters);
  let lastError: Error | null = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'SafeReachAI/1.0 (Safety Platform)',
          'Accept': 'application/json',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(12000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${endpoint}`);
      }

      const data: OverpassResponse = await response.json();
      return parseOverpassElements(data.elements || [], lat, lng, maxAllowedRadiusKm);
    } catch (err) {
      console.warn(`Overpass query failed on ${endpoint}:`, err);
      lastError = err as Error;
    }
  }

  if (lastError) {
    console.error('All Overpass API endpoints failed:', lastError);
  }
  return [];
}

function parseOverpassElements(
  elements: OverpassElement[],
  userLat: number,
  userLng: number,
  maxAllowedRadiusKm: number
): SafePlace[] {
  const results: SafePlace[] = [];
  const seenIds = new Set<string>();

  for (const el of elements) {
    // Correctly resolve latitude and longitude from node or way center
    const lat = typeof el.lat === 'number' ? el.lat : typeof el.center?.lat === 'number' ? el.center.lat : null;
    const lon = typeof el.lon === 'number' ? el.lon : typeof el.center?.lon === 'number' ? el.center.lon : null;

    // Strict validation of coordinates
    if (
      lat === null || lon === null ||
      isNaN(lat) || isNaN(lon) ||
      lat < -90 || lat > 90 ||
      lon < -180 || lon > 180
    ) {
      continue;
    }

    const tags = el.tags || {};
    const amenity = tags.amenity || '';
    const railway = tags.railway || '';
    const station = tags.station || '';
    const shop = tags.shop || '';
    const tourism = tags.tourism || '';
    const healthcare = tags.healthcare || '';
    const government = tags.government || '';

    let type: SafePlaceType = 'safe_haven';
    let defaultName = 'Verified Safe Location';
    let securityFeature = 'Public Safety Haven';

    // 1. Police
    if (amenity === 'police' || amenity === 'police_booth' || government === 'public_safety') {
      type = 'police';
      defaultName = amenity === 'police_booth' ? 'Police Assistance Booth' : 'Police Station';
      securityFeature = 'Active Police Officers • Immediate Response';
    } 
    // 2. Metro & Public Transit
    else if (
      railway === 'station' || 
      station === 'subway' || 
      railway === 'subway_entrance' || 
      amenity === 'bus_station'
    ) {
      type = 'transit';
      if (station === 'subway' || railway === 'subway_entrance') {
        defaultName = 'Metro Station / Subway Entry';
      } else if (amenity === 'bus_station') {
        defaultName = 'Central Bus Terminal';
      } else {
        defaultName = 'Railway / Transit Hub';
      }
      securityFeature = 'CISF / Security Guards • CCTV • High Footfall';
    }
    // 3. Shopping Malls & Commercial Supermarkets
    else if (shop === 'mall' || shop === 'department_store' || shop === 'supermarket') {
      type = 'commercial';
      defaultName = shop === 'mall' ? 'Shopping Mall & Plaza' : 'Commercial Superstore';
      securityFeature = 'Entry Security Guards • Metal Detectors • Active Crowds';
    }
    // 4. Hospitals & Clinics
    else if (
      amenity === 'hospital' || 
      amenity === 'clinic' || 
      amenity === 'doctors' || 
      healthcare === 'hospital' || 
      healthcare === 'clinic'
    ) {
      type = 'hospital';
      defaultName = amenity === 'hospital' || healthcare === 'hospital' ? 'Hospital / Emergency Care' : 'Medical Care Clinic';
      securityFeature = '24/7 Medical Staff • Emergency Care';
    }
    // 5. 24/7 Fuel Stations / Petrol Pumps
    else if (amenity === 'fuel') {
      type = 'fuel_station';
      defaultName = '24/7 Fuel Station';
      securityFeature = '24/7 Staffed Attendants • Well-Lit Perimeter • CCTV';
    }
    // 6. Hotels & 24/7 Lobbies
    else if (tourism === 'hotel') {
      type = 'hotel';
      defaultName = 'Hotel Lobby & Front Desk';
      securityFeature = '24/7 Front Desk Staff • Doormen & Entry Security';
    }
    // 7. Banks & Guarded ATMs
    else if (amenity === 'bank' || amenity === 'atm') {
      type = 'bank_atm';
      defaultName = amenity === 'bank' ? 'Commercial Bank Branch' : 'Guarded 24/7 ATM';
      securityFeature = 'Security Guarded • CCTV Monitored';
    }
    // 8. Pharmacies
    else if (amenity === 'pharmacy' || healthcare === 'pharmacy') {
      type = 'pharmacy';
      defaultName = 'Pharmacy / Medical Store';
      securityFeature = 'Licensed Pharmacist • Medical Supplies';
    }
    // 9. Fire Stations
    else if (amenity === 'fire_station') {
      type = 'fire_station';
      defaultName = 'Fire & Rescue Station';
      securityFeature = 'Emergency First Responders • 24/7 Staffed';
    } else {
      continue;
    }

    const dist = calculateDistanceKm(userLat, userLng, lat, lon);

    // Strict distance ceiling: Exclude any place exceeding the search radius
    // (with 10% polygon tolerance, never return places further away)
    if (dist > maxAllowedRadiusKm * 1.1) {
      continue;
    }

    const name = tags.name || tags['name:en'] || defaultName;
    const id = `${el.type}_${el.id}`;

    if (seenIds.has(id)) continue;
    seenIds.add(id);

    // Build human-readable address
    const addressParts: string[] = [];
    if (tags['addr:full']) {
      addressParts.push(tags['addr:full']);
    } else {
      if (tags['addr:housenumber'] && tags['addr:street']) {
        addressParts.push(`${tags['addr:housenumber']} ${tags['addr:street']}`);
      } else if (tags['addr:street']) {
        addressParts.push(tags['addr:street']);
      }
      if (tags['addr:suburb']) addressParts.push(tags['addr:suburb']);
      if (tags['addr:city']) addressParts.push(tags['addr:city']);
    }

    const address = addressParts.length > 0 ? addressParts.join(', ') : undefined;
    const phone = tags.phone || tags['contact:phone'];
    const openingHours = tags.opening_hours;
    const is24x7 = openingHours
      ? openingHours.includes('24/7')
      : type === 'police' || type === 'hospital' || type === 'fuel_station' || type === 'hotel' || type === 'fire_station';

    results.push({
      id,
      name,
      type,
      lat,
      lng: lon,
      distanceKm: dist,
      address,
      city: tags['addr:city'],
      phone,
      openingHours,
      wheelchair: tags.wheelchair === 'yes',
      operator: tags.operator,
      is24x7,
      securityFeature,
      source: 'osm_overpass',
    });
  }

  return results;
}
