export type RiskLevel = 'safe zone' | 'spicy' | 'risky' | 'rip 💀';

export interface RiskConfig {
  label: RiskLevel;
  color: string;
  bg: string;
  text: string;
}

const RISK_CONFIGS: RiskConfig[] = [
  { label: 'safe zone', color: '#2a7a2a', bg: '#dcf0dc', text: '#1a4d1a' },
  { label: 'spicy',     color: '#c07000', bg: '#fdefd0', text: '#7a4400' },
  { label: 'risky',     color: '#d0021b', bg: '#fdd0d5', text: '#7a0010' },
  { label: 'rip 💀',   color: '#7a0010', bg: '#f0c0c5', text: '#4a0008' },
];

export function getRisk(rating: number): RiskConfig {
  if (rating >= 4.3) return RISK_CONFIGS[0];
  if (rating >= 4.0) return RISK_CONFIGS[1];
  if (rating >= 3.7) return RISK_CONFIGS[2];
  return RISK_CONFIGS[3];
}

export function starsFor(rating: number): string {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}
