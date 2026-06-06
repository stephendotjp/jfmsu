import type { Location } from '@/lib/types';
import { getRisk, starsFor } from '@/lib/risk';
import { RiskPill } from './RiskPill';
import { RatingBar } from './RatingBar';

function mapsUrl(location: Location): string {
  if (location.placeId && !location.placeId.startsWith('mock')) {
    return `https://www.google.com/maps/place/?q=place_id:${location.placeId}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name + ' ' + location.address)}`;
}

export function LocationCard({ location, rank }: { location: Location; rank: number }) {
  const risk = getRisk(location.rating);
  const isTop = rank === 1;

  return (
    <div
      className={`bg-white rounded-xl border p-5 transition-shadow hover:shadow-md ${
        isTop ? 'border-l-4' : 'border-gray-200'
      }`}
      style={isTop ? { borderLeftColor: '#00004b', borderTopColor: '#e5e7eb', borderRightColor: '#e5e7eb', borderBottomColor: '#e5e7eb' } : {}}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className="text-2xl font-black shrink-0 w-8 text-right leading-tight"
            style={{ color: isTop ? '#00004b' : '#9ca3af' }}
          >
            #{rank}
          </span>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 leading-snug">{location.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{location.address}</p>
          </div>
        </div>
        <RiskPill rating={location.rating} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-[#c07000] tracking-tight text-sm">{starsFor(location.rating)}</span>
        <span className="font-semibold text-gray-800">{location.rating.toFixed(1)}</span>
        <span className="text-xs text-gray-400">({location.reviewCount.toLocaleString()} reviews)</span>
        <a
          href={mapsUrl(location)}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 text-xs text-[#00004b] hover:underline shrink-0"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Google Maps
        </a>
      </div>

      <div className="mt-3">
        <RatingBar rating={location.rating} />
      </div>
    </div>
  );
}
