'use client';

import { useCallback, useRef, useState } from 'react';

import { useJourneyDriver, useJourneyWidth } from '@/hooks/useJourney';
import { useTelemetry } from '@/hooks/useTelemetry';
import type { Tier } from '@/lib/perf-tier';

import { Scene } from './Scene';
import { StaticDiagram } from './StaticDiagram';
import { Ticker } from './Ticker';

const HERO_BOX = 'inset-x-0 top-0 h-[max(760px,100svh)]';

/**
 * Loaded via dynamic(ssr:false): everything below here is browser-only.
 * One tree, one tier switch. Pausing disconnects telemetry and replaces the
 * moving scene with a static diagram. Reduced-motion devices start paused.
 *
 * Two siblings inside HeroBackdrop:
 *   - the visual layer. Hero sized and absolute by default (scrolls away
 *     with the hero). When the camera journey is on it turns sticky, so the
 *     same canvas stays behind the Expertise section. `isolate` keeps the
 *     drei Html labels (which carry a huge z-index) under the page content.
 *   - the hero overlay (pause button and ticker), always hero sized, so the
 *     controls stay in the hero in both modes.
 */
export default function TelemetryHero({ tier }: { tier: Tier }) {
  const [paused, setPaused] = useState(tier === 'static');
  const [webglFailed, setWebglFailed] = useState(false);
  const telemetry = useTelemetry(paused);
  const layerRef = useRef<HTMLDivElement>(null);

  const wide = useJourneyWidth();
  const journey = tier === 'full' && wide && !paused && !webglFailed;
  const faded = useJourneyDriver(journey, layerRef);
  const onWebGLFailed = useCallback(() => setWebglFailed(true), []);

  return (
    <>
      <div
        ref={layerRef}
        aria-hidden="true"
        className={`${journey ? 'sticky' : 'absolute'} ${HERO_BOX} isolate w-full`}
      >
        {paused || tier === 'static' ? (
          <StaticDiagram latest={paused ? null : telemetry.latest} />
        ) : (
          <Scene
            tier={tier}
            latest={telemetry.latest}
            containerRef={layerRef}
            suspended={faded}
            onWebGLFailed={onWebGLFailed}
          />
        )}
      </div>
      <div className={`pointer-events-none absolute ${HERO_BOX}`}>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          className="pointer-events-auto absolute right-6 top-6 z-30 rounded-md border border-zinc-500 bg-zinc-950 px-4 py-3 text-sm text-zinc-100"
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
    </>
  );
}
