import { Coordinates, SafePlace, SafePlaceType } from '@/types/places';

/**
 * Calculates Haversine distance in Kilometers between two coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
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
 * Queries OpenStreetMap Overpass API for real-world safe havens:
 * Police, Hospitals, Metro/Subway stations, Shopping Malls, 24/7 Fuel Stations, Hotels, Banks/ATMs, and Pharmacies.
 */
export async function fetchNearbySafePlaces(coords: Coordinates, radiusMeters: number = 5000): Promise<SafePlace[]> {
  const { lat, lng } = coords;

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="police"](around:${radiusMeters},${lat},${lng});
      way["amenity"="police"](around:${radiusMeters},${lat},${lng});
      node["amenity"="police_booth"](around:${radiusMeters},${lat},${lng});
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
      way["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
      node["healthcare"="hospital"](around:${radiusMeters},${lat},${lng});
      way["healthcare"="hospital"](around:${radiusMeters},${lat},${lng});
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
      node["amenity"="atm"](around:${radiusMeters},${lat},${lng});
      node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lng});
      way["amenity"="pharmacy"](around:${radiusMeters},${lat},${lng});
      node["amenity"="fire_station"](around:${radiusMeters},${lat},${lng});
      way["amenity"="fire_station"](around:${radiusMeters},${lat},${lng});
    );
    out center 150 tags;
  `;

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
      const places = parseOverpassElements(data.elements || [], lat, lng);
      
      // Sort by distance ascending
      return places.sort((a, b) => a.distanceKm - b.distanceKm);
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

function parseOverpassElements(elements: OverpassElement[], userLat: number, userLng: number): SafePlace[] {
  const results: SafePlace[] = [];
  const seenIds = new Set<string>();

  for (const el of elements) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (!lat || !lon) continue;

    const tags = el.tags || {};
    const amenity = tags.amenity || '';
    const railway = tags.railway || '';
    const station = tags.station || '';
    const shop = tags.shop || '';
    const tourism = tags.tourism || '';
    const healthcare = tags.healthcare || '';

    let type: SafePlaceType = 'safe_haven';
    let defaultName = 'Verified Safe Location';
    let securityFeature = 'Public Safety Haven';

    // 1. Police
    if (amenity === 'police' || amenity === 'police_booth') {
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
    else if (amenity === 'hospital' || amenity === 'clinic' || healthcare === 'hospital' || healthcare === 'clinic') {
      type = 'hospital';
      defaultName = amenity === 'hospital' || healthcare === 'hospital' ? 'Hospital / Emergency Care' : 'Medical Care Clinic';
      securityFeature = '24/7 Medical Staff • Emergency Room';
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
      continue; // Skip unrecognized
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

    const dist = calculateDistanceKm(userLat, userLng, lat, lon);

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
