export function RatingBar({ score }: { score: number }) {
  // jfmsuScore tops out around 5.15; clamp to 100%
  const pct = Math.min(100, (score / 5) * 100);
  return (
    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(to right, #7a0010 0%, #d0021b 58%, #c07000 72%, #2a7a2a 88%)',
        }}
      />
    </div>
  );
}
