import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'just f*** my shit up — QB House Japan ranker';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PILLS = [
  { label: 'safe zone', bg: '#dcf0dc', color: '#1a4d1a' },
  { label: 'spicy',     bg: '#fdefd0', color: '#7a4400' },
  { label: 'risky',     bg: '#fdd0d5', color: '#7a0010' },
  { label: 'rip',       bg: '#f0c0c5', color: '#4a0008' },
];

export default async function Image() {
  let faceDataUrl: string | null = null;
  try {
    const res = await fetch('https://jfmsu.vercel.app/jfmsu.png');
    if (res.ok) {
      const buf = await res.arrayBuffer();
      faceDataUrl = `data:image/png;base64,${Buffer.from(buf).toString('base64')}`;
    }
  } catch {
    // Face image unavailable — renders fine without it
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#00004b',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 80px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient bar across top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(to right, #7a0010, #d0021b, #c07000, #2a7a2a)',
            display: 'flex',
          }}
        />

        {/* Face watermark — bottom right */}
        {faceDataUrl && (
          <img
            src={faceDataUrl}
            width={280}
            height={280}
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              objectFit: 'cover',
              objectPosition: 'top center',
              opacity: 0.3,
              borderTopLeftRadius: 20,
            }}
          />
        )}

        {/* QB mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 44 }}>
          <div
            style={{
              background: 'white',
              color: '#00004b',
              fontWeight: 900,
              fontSize: 28,
              width: 54,
              height: 54,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}
          >
            QB
          </div>
          <span
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: 13,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            HOUSE
          </span>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 24 }}>
          <span
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: 'white',
              lineHeight: 0.92,
              display: 'flex',
            }}
          >
            just fuck my
          </span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: 'white',
              lineHeight: 0.92,
              display: 'flex',
            }}
          >
            shit up
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            color: 'rgba(255,255,255,0.38)',
            fontSize: 22,
            display: 'flex',
          }}
        >
          QB House Japan · ranked by composite score · ¥1,400 per regret
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: 'flex' }} />

        {/* Risk pills */}
        <div style={{ display: 'flex', gap: 12 }}>
          {PILLS.map(({ label, bg, color }) => (
            <div
              key={label}
              style={{
                background: bg,
                color,
                padding: '10px 26px',
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
