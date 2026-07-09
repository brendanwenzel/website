/**
 * MOCK MODE — fake telemetry for developing/deploying the frontend before the
 * backend exists.
 *
 * Active exactly when NEXT_PUBLIC_TELEMETRY_URL is unset (see useTelemetry).
 * To go live, set the env var and redeploy; to come back to mock, unset it.
 * The ticker labels mock events "simulated" so this state is never mistaken
 * for production traffic.
 */

import type { Source, TelemetryEvent } from './telemetry-types';

const MOCK_EVENTS: Array<{ source: Source; types: string[]; weight: number }> = [
  { source: 'CAPI Bridge', types: ['Purchase Captured', 'Event Relayed'], weight: 5 },
  { source: 'Spend → Sheets', types: ['Spend Synced', 'Row Updated'], weight: 3 },
  { source: 'Sample Automation', types: ['Sample Requested', 'Sample Shipped'], weight: 2 },
];

const TOTAL_WEIGHT = MOCK_EVENTS.reduce((n, e) => n + e.weight, 0);

function randomEvent(): TelemetryEvent {
  let roll = Math.random() * TOTAL_WEIGHT;
  const bucket =
    MOCK_EVENTS.find((e) => (roll -= e.weight) < 0) ?? MOCK_EVENTS[0];
  return {
    event_type: bucket.types[Math.floor(Math.random() * bucket.types.length)],
    source: bucket.source,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Emits weighted-random events on a jittered interval. Returns a stop
 * function (used as the effect cleanup — Strict Mode safe).
 */
export function startMockTelemetry(
  onEvent: (event: TelemetryEvent) => void,
  { minMs = 2500, maxMs = 7000 } = {},
): () => void {
  let timer: ReturnType<typeof setTimeout>;
  let stopped = false;

  const schedule = (delay: number) => {
    timer = setTimeout(() => {
      if (stopped) return;
      onEvent(randomEvent());
      schedule(minMs + Math.random() * (maxMs - minMs));
    }, delay);
  };

  // First event lands quickly so the hero feels alive on load.
  schedule(800);

  return () => {
    stopped = true;
    clearTimeout(timer);
  };
}
