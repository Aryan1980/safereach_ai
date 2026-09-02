import { NextRequest, NextResponse } from 'next/server';
import { fetchNearbySafePlaces } from '@/services/overpassService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lat, lng, radius = 5000 } = body;

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json(
        { error: 'Valid latitude and longitude are required.' },
        { status: 400 }
      );
    }

    const places = await fetchNearbySafePlaces({ lat, lng }, radius);
    return NextResponse.json({ places, count: places.length });
  } catch (error: unknown) {
    console.error('API /api/places error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve safe places from map provider.', places: [] },
      { status: 500 }
    );
  }
}
