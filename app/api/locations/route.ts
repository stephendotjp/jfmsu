import { NextRequest, NextResponse } from 'next/server';
import { MOCK_LOCATIONS } from '@/lib/mock';
import type { Location } from '@/lib/types';

const PLACES_URL = 'https://places.googleapis.com/v1/places:searchText';

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city') ?? 'Osaka';
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ locations: MOCK_LOCATIONS, source: 'mock' });
  }

  try {
    const res = await fetch(PLACES_URL, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.id,places.location',
      },
      body: JSON.stringify({ textQuery: `QB House ${city}`, languageCode: 'ja', maxResultCount: 20 }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Places API error:', res.status, errText);
      return NextResponse.json({ locations: MOCK_LOCATIONS, source: 'mock', apiError: `${res.status}: ${errText}` });
    }

    const data = await res.json();
    const places: Location[] = (data.places ?? [])
      .filter((p: Record<string, unknown>) => typeof p.rating === 'number')
      .map((p: Record<string, unknown>) => ({
        name: (p.displayName as { text?: string })?.text ?? 'QB House',
        address: (p.formattedAddress as string) ?? '',
        rating: p.rating as number,
        reviewCount: (p.userRatingCount as number) ?? 0,
        placeId: (p.id as string) ?? '',
        lat: (p.location as { latitude?: number })?.latitude ?? 0,
        lng: (p.location as { longitude?: number })?.longitude ?? 0,
      }));

    if (places.length === 0) {
      return NextResponse.json({ locations: MOCK_LOCATIONS, source: 'mock' });
    }

    return NextResponse.json({ locations: places, source: 'api' });
  } catch (err) {
    console.error('Places fetch failed:', err);
    return NextResponse.json({ locations: MOCK_LOCATIONS, source: 'mock' });
  }
}
