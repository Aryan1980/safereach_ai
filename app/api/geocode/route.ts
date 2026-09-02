import { NextRequest, NextResponse } from 'next/server';
import { searchLocations } from '@/services/geocodingService';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchLocations(q);
    return NextResponse.json({ results });
  } catch (error: unknown) {
    console.error('API /api/geocode error:', error);
    return NextResponse.json({ results: [], error: 'Geocoding query failed' }, { status: 500 });
  }
}
