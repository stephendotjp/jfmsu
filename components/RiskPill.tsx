import type { RiskTier } from '@/lib/risk';

const STYLES: Record<RiskTier, { bg: string; text: string }> = {
  'safe zone': { bg: '#dcf0dc', text: '#1a4d1a' },
  'spicy':     { bg: '#fdefd0', text: '#7a4400' },
  'risky':     { bg: '#fdd0d5', text: '#7a0010' },
  'rip':       { bg: '#f0c0c5', text: '#4a0008' },
};

const LABELS: Record<RiskTier, string> = {
  'safe zone': 'safe zone',
  'spicy':     'spicy',
  'risky':     'risky',
  'rip':       'rip 💀',
};

export function RiskPill({ tier }: { tier: RiskTier }) {
  const s = STYLES[tier];
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {LABELS[tier]}
    </span>
  );
}
