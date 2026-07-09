'use client';

/**
 * Opens an EventSource to NEXT_PUBLIC_TELEMETRY_URL and exposes a rolling
 * event list + connection status. With the env var unset, runs in mock mode
 * (lib/mock-telemetry.ts) so the frontend is fully buildable before the
 * backend exists.
 *
 * Degradation contract: connection trouble only ever changes `status`
 * (ticker copy). The scene keeps its calm idle animation — the hero must
 * never look broken because the box hiccuped.
 */

import { useEffect, useReducer } from 'react';

import { startMockTelemetry } from '@/lib/mock-telemetry';
import {
  parseTelemetryEvent,
  SOURCES,
  type ConnectionStatus,
  type Source,
  type StampedEvent,
  type TelemetryEvent,
} from '@/lib/telemetry-types';

const MAX_EVENTS = 50;

export interface TelemetryState {
  status: ConnectionStatus;
  /** Newest first, capped at MAX_EVENTS. */
  events: StampedEvent[];
  /** `latest.seq` is the scene's pulse trigger key. */
  latest: StampedEvent | null;
  countsBySource: Record<Source, number>;
}

type Action =
  | { type: 'open' }
  | { type: 'event'; event: TelemetryEvent }
  | { type: 'error'; readyState: number }
  | { type: 'mock-start' };

const zeroCounts = (): Record<Source, number> =>
  Object.fromEntries(SOURCES.map((s) => [s, 0])) as Record<Source, number>;

function initialState(status: ConnectionStatus): TelemetryState {
  return { status, events: [], latest: null, countsBySource: zeroCounts() };
}

function reducer(state: TelemetryState, action: Action): TelemetryState {
  switch (action.type) {
    case 'open':
      return { ...state, status: 'live' };
    case 'mock-start':
      return { ...state, status: 'mock' };
    case 'error': {
      // CONNECTING = the browser is auto-retrying (native EventSource
      // behavior). CLOSED = fatal, it gave up.
      const status: ConnectionStatus =
        action.readyState === EventSource.CLOSED ? 'offline' : 'reconnecting';
      return { ...state, status };
    }
    case 'event': {
      const stamped: StampedEvent = {
        ...action.event,
        seq: (state.latest?.seq ?? 0) + 1,
        receivedAt: Date.now(),
      };
      return {
        ...state,
        events: [stamped, ...state.events].slice(0, MAX_EVENTS),
        latest: stamped,
        countsBySource: {
          ...state.countsBySource,
          [stamped.source]: state.countsBySource[stamped.source] + 1,
        },
      };
    }
  }
}

// NEXT_PUBLIC_* is inlined at build time; changing it requires a redeploy.
const TELEMETRY_URL = process.env.NEXT_PUBLIC_TELEMETRY_URL;

export function useTelemetry(): TelemetryState {
  const [state, dispatch] = useReducer(
    reducer,
    TELEMETRY_URL ? 'connecting' : 'mock',
    initialState,
  );

  useEffect(() => {
    if (!TELEMETRY_URL) {
      dispatch({ type: 'mock-start' });
      // Returning the stop function makes this Strict Mode safe (React 19
      // dev double-invokes effects; without cleanup you'd get doubled events).
      return startMockTelemetry((event) => dispatch({ type: 'event', event }));
    }

    const es = new EventSource(TELEMETRY_URL);
    es.onopen = () => dispatch({ type: 'open' });
    es.onmessage = (m) => {
      const event = parseTelemetryEvent(m.data);
      if (event) dispatch({ type: 'event', event });
    };
    es.onerror = () => dispatch({ type: 'error', readyState: es.readyState });
    return () => es.close();
  }, []);

  return state;
}
