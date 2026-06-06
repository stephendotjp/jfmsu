import type { Location } from '@/lib/types';
import type { RiskTier } from '@/lib/risk';
import { confidenceTier, starsFor } from '@/lib/risk';
import { RiskPill } from './RiskPill';
import { RatingBar } from './RatingBar';

function mapsUrl(location: Location): string {
  if (location.placeId && !location.placeId.startsWith('mock')) {
    return `https://www.google.com/maps/place/?q=place_id:${location.placeId}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name + ' ' + location.address)}`;
}

const CONFIDENCE_DISPLAY: Record<ReturnType<typeof confidenceTier>, { label: string; color: string }> = {
  'high':        { label: '📊 high confidence',   color: '#2a7a2a' },
  'medium':      { label: '📊 mid confidence',    color: '#6b7280' },
  'low':         { label: '⚠️ low confidence',    color: '#c07000' },
  'unreliable':  { label: '⚠️ unreliable',        color: '#d0021b' },
};

interface Props {
  location: Location;
  rank: number;
  tier: RiskTier;
  score: number;
}

export function LocationCard({ location, rank, tier, score }: Props) {
  const isTop = rank === 1;
  const conf = confidenceTier(location.reviewCount);
  const confDisplay = CONFIDENCE_DISPLAY[conf];

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-md"
      style={isTop ? { borderLeft: '3px solid #00004b' } : {}}
    >
      <div className="flex items-start gap-3">
        {/* Rank */}
        <span
          className="tabular-nums font-black text-base shrink-0 w-7 text-right pt-px leading-none"
          style={{ color: isTop ? '#00004b' : '#d1d5db' }}
        >
          {rank}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name + pill */}
          <div className="flex items-start gap-2">
            <h3 className="font-bold text-gray-900 text-sm leading-snug flex-1 min-w-0">
              {location.name}
            </h3>
            <div className="shrink-0 pt-px">
              <RiskPill tier={tier} />
            </div>
          </div>

          {/* Address */}
          <p className="text-xs text-gray-400 mt-1 leading-snug">{location.address}</p>

          {/* Rating row */}
          <div className="mt-2.5 flex items-center gap-1.5 text-xs flex-wrap">
            <span className="text-gray-500 tracking-tight">{starsFor(location.rating)}</span>
            <span className="font-semibold text-gray-800">{location.rating.toFixed(1)}</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-400">{location.reviewCount.toLocaleString()} reviews</span>
            <span className="text-gray-300">·</span>
            <span style={{ color: confDisplay.color }}>{confDisplay.label}</span>
            <a
              href={mapsUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-[#00004b] hover:underline shrink-0"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Maps
            </a>
          </div>

          {/* Bar driven by jfmsuScore */}
          <div className="mt-2">
            <RatingBar score={score} />
          </div>
        </div>
      </div>
    </div>
  );
}
