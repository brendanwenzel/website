import { ImageResponse } from 'next/og';

/**
 * OG card generated at build time (static route, no runtime cost). Echoes the
 * hero: dark ground, node-diagram mark, name + positioning line.
 */
export const alt = 'Brendan Wenzel — Director of Social Commerce';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const NODES = [
  { cx: 950, cy: 200, color: '#34d399' },
  { cx: 1090, cy: 260, color: '#38bdf8' },
  { cx: 990, cy: 380, color: '#fbbf24' },
];
const HUB = { cx: 1020, cy: 290 };

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#09090b',
          backgroundImage: 'radial-gradient(ellipse at 80% 40%, #122031 0%, #09090b 65%)',
        }}
      >
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {NODES.map((n, i) => (
            <line
              key={`l${i}`}
              x1={n.cx}
              y1={n.cy}
              x2={HUB.cx}
              y2={HUB.cy}
              stroke="#3f3f46"
              strokeWidth="2"
            />
          ))}
          <circle cx={HUB.cx} cy={HUB.cy} r="10" fill="#a1a1aa" />
          {NODES.map((n, i) => (
            <circle key={`c${i}`} cx={n.cx} cy={n.cy} r="16" fill={n.color} />
          ))}
        </svg>
        <div style={{ display: 'flex', fontSize: 28, color: '#34d399', marginBottom: 24 }}>
          production systems · live
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 600,
            color: '#fafafa',
            letterSpacing: '-0.02em',
          }}
        >
          Brendan Wenzel
        </div>
        <div style={{ display: 'flex', fontSize: 36, color: '#a1a1aa', marginTop: 16 }}>
          Director of Social Commerce
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#71717a', marginTop: 40 }}>
          Media buying · Social commerce · Marketing engineering
        </div>
      </div>
    ),
    size,
  );
}
