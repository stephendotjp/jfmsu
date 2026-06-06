import { getRisk } from '@/lib/risk';

export function RiskPill({ rating }: { rating: number }) {
  const risk = getRisk(rating);
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
      style={{ backgroundColor: risk.bg, color: risk.text }}
    >
      {risk.label}
    </span>
  );
}
