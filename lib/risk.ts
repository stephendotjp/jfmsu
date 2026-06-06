export type RiskTier = 'safe zone' | 'spicy' | 'risky' | 'rip';
export type ConfidenceTier = 'high' | 'medium' | 'low' | 'unreliable';

const CONFIDENCE_WEIGHT = 50;

export function bayesianRating(rating: number, reviewCount: number, cityMean: number): number {
  return (reviewCount * rating + CONFIDENCE_WEIGHT * cityMean) / (reviewCount + CONFIDENCE_WEIGHT);
}

export function jfmsuScore(rating: number, reviewCount: number, cityMean: number): number {
  const bayes = bayesianRating(rating, reviewCount, cityMean);
  const confidenceBonus = Math.min(reviewCount / 500, 1) * 0.15;
  return bayes + confidenceBonus;
}

export function confidenceTier(reviewCount: number): ConfidenceTier {
  if (reviewCount >= 200) return 'high';
  if (reviewCount >= 75)  return 'medium';
  if (reviewCount >= 20)  return 'low';
  return 'unreliable';
}

// rank is 1-indexed position in quality-sorted (best → worst) order
export function relativeTier(rank: number, total: number): RiskTier {
  const pct = rank / total;
  if (pct <= 0.20) return 'safe zone';
  if (pct <= 0.45) return 'spicy';
  if (pct <= 0.75) return 'risky';
  return 'rip';
}

export function starsFor(rating: number): string {
  const full = Math.round(rating);
  return '★'.repeat(Math.max(0, full)) + '☆'.repeat(Math.max(0, 5 - full));
}
