'use client';

import { useEffect, useState } from 'react';

import { HUB_COLOR, NODES, sourceIndex } from '@/lib/nodes-config';
import type { StampedEvent } from '@/lib/telemetry-types';

/**
 * Reduced-motion / low-end / WebGL-failure fallback: the same node diagram as
 * inline SVG. The only "motion" is a CSS opacity blip on the source node when
 * an event lands (opacity change is acceptable under prefers-reduced-motion;
 * nothing translates). The ticker still updates textually alongside.
 */

// World -> SVG coordinate mapping for the shared NODES positions.
const toSvg = ([x, y]: [number, number, number]) => ({ cx: 300 + x * 88, cy: 185 - y * 88 });
const HUB = { cx: 300, cy: 185 };

export function StaticDiagram({ latest }: { latest: StampedEvent | null }) {
  const [flashIdx, setFlashIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!latest) return;
    const idx = sourceIndex(latest.source);
    if (idx < 0) return;
    setFlashIdx(idx);
    const timer = setTimeout(() => setFlashIdx(null), 800);
    return () => clearTimeout(timer);
  }, [latest]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        viewBox="0 0 600 370"
        className="h-auto w-full max-w-xl opacity-80"
        aria-hidden="true"
      >
        {NODES.map((node) => {
          const { cx, cy } = toSvg(node.position);
          return (
            <line
              key={`edge-${node.source}`}
              x1={cx}
              y1={cy}
              x2={HUB.cx}
              y2={HUB.cy}
              stroke="#3f3f46"
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}
        <circle cx={HUB.cx} cy={HUB.cy} r="10" fill="none" stroke={HUB_COLOR} strokeWidth="1.5" opacity="0.6" />
        {NODES.map((node, i) => {
          const { cx, cy } = toSvg(node.position);
          const flashing = flashIdx === i;
          return (
            <g key={node.source}>
              <circle
                cx={cx}
                cy={cy}
                r="26"
                fill={node.color}
                style={{ opacity: flashing ? 0.35 : 0.08, transition: 'opacity 400ms ease' }}
              />
              <circle cx={cx} cy={cy} r="14" fill="none" stroke={node.color} strokeWidth="1.5" opacity="0.8" />
              <text
                x={cx}
                y={cy + 46}
                textAnchor="middle"
                fill="#71717a"
                fontSize="11"
                fontFamily="var(--font-geist-mono), monospace"
                letterSpacing="0.08em"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
