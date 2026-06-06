import { getRisk } from '@/lib/risk';

export function RatingBar({ rating }: { rating: number }) {
  const risk = getRisk(rating);
  const pct = Math.min(100, (rating / 5) * 100);
  return (
    <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: risk.color }}
      />
    </div>
  );
}
