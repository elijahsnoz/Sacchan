import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/site';

export const alt = `${SITE_NAME} — Small Contributions. Massive Impact.`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Branded social share card. Rendered at build/request time by Satori, so it
// only uses flexbox + inline styles (no CSS grid, no external assets).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundColor: '#04070d',
          backgroundImage:
            'radial-gradient(circle at 80% 15%, rgba(99,167,255,0.22), transparent 45%), radial-gradient(circle at 15% 85%, rgba(215,181,109,0.18), transparent 45%)',
          color: '#f5ead7',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 999,
              border: '2px solid rgba(215,181,109,0.5)',
              color: '#d7b56d',
              fontSize: 30,
              fontWeight: 700
            }}
          >
            SAC
          </div>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 8,
              textTransform: 'uppercase',
              color: '#63a7ff'
            }}
          >
            Sacchan Token
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, color: '#ffffff', lineHeight: 1.05 }}>
            Small Contributions.
          </div>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, color: '#d7b56d', lineHeight: 1.05 }}>
            Massive Impact.
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: 'rgba(245,234,215,0.75)', marginTop: 12 }}>
            The town that feeds Sacchan — a premium Web3 community network.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
