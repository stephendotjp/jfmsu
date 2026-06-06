import { NextRequest, NextResponse } from 'next/server';
import { MOCK_LOCATIONS } from '@/lib/mock';
import type { Location } from '@/lib/types';

const PLACES_URL = 'https://places.googleapis.com/v1/places:searchText';

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city') ?? 'Osaka';
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(MOCK_LOCATIONS);
  }

  try {
    const res = await fetch(PLACES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.id,places.location',
      },
      body: JSON.stringify({ textQuery: `QB House ${city}`, languageCode: 'ja', maxResultCount: 20 }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(MOCK_LOCATIONS);
    }

    const data = await res.json();
    const places: Location[] = (data.places ?? []).map((p: Record<string, unknown>) => ({
      name: (p.displayName as { text?: string })?.text ?? 'QB House',
      address: (p.formattedAddress as string) ?? '',
      rating: (p.rating as number) ?? 0,
      reviewCount: (p.userRatingCount as number) ?? 0,
      placeId: (p.id as string) ?? '',
      lat: (p.location as { latitude?: number })?.latitude ?? 0,
      lng: (p.location as { longitude?: number })?.longitude ?? 0,
    }));

    return NextResponse.json(places.length ? places : MOCK_LOCATIONS);
  } catch {
    return NextResponse.json(MOCK_LOCATIONS);
  }
}
