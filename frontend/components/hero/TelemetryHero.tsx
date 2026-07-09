'use client';

import { useRef } from 'react';

import { useTelemetry } from '@/hooks/useTelemetry';
import type { Tier } from '@/lib/perf-tier';

import { Scene } from './Scene';
import { StaticDiagram } from './StaticDiagram';
import { Ticker } from './Ticker';

/**
 * Loaded via dynamic(ssr:false) — everything below here is browser-only.
 * One tree, one tier switch; useTelemetry runs in ALL tiers so the ticker is
 * always live even when the visual is the static SVG.
 */
export default function TelemetryHero({ tier }: { tier: Tier }) {
  const telemetry = useTelemetry();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="h-full w-full">
      {tier === 'static' ? (
        <StaticDiagram latest={telemetry.latest} />
      ) : (
        <Scene tier={tier} latest={telemetry.latest} containerRef={containerRef} />
      )}
      <Ticker
        events={telemetry.events}
        status={telemetry.status}
        counts={telemetry.countsBySource}
      />
    </div>
  );
}
