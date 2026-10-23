'use client';

import { useRef, useState } from 'react';

import { useTelemetry } from '@/hooks/useTelemetry';
import type { Tier } from '@/lib/perf-tier';

import { Scene } from './Scene';
import { StaticDiagram } from './StaticDiagram';
import { Ticker } from './Ticker';

/**
 * Loaded via dynamic(ssr:false) — everything below here is browser-only.
 * One tree, one tier switch. Pausing disconnects telemetry and replaces the
 * moving scene with a static diagram. Reduced-motion devices start paused.
 */
export default function TelemetryHero({ tier }: { tier: Tier }) {
  const [paused, setPaused] = useState(tier === 'static');
  const telemetry = useTelemetry(paused);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="h-full w-full">
      <div aria-hidden="true" className="h-full w-full">
        {paused || tier === 'static' ? (
          <StaticDiagram latest={paused ? null : telemetry.latest} />
        ) : (
          <Scene tier={tier} latest={telemetry.latest} containerRef={containerRef} />
        )}
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        className="absolute right-6 top-32 z-30 rounded-md border border-zinc-500 bg-zinc-950 px-4 py-3 text-sm text-zinc-100"
      >
        {paused ? 'Resume animation and updates' : 'Pause animation and updates'}
      </button>
      <Ticker
        paused={paused}
        events={telemetry.events}
        status={telemetry.status}
        counts={telemetry.countsBySource}
      />
    </div>
  );
}
