'use client';

import { useEffect, useReducer } from 'react';

import type { ConnectionStatus, Source, StampedEvent } from '@/lib/telemetry-types';

interface TickerProps {
  events: StampedEvent[];
  status: ConnectionStatus;
  counts: Record<Source, number>;
}

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  live: 'live',
  mock: 'simulated',
  connecting: 'connecting…',
  reconnecting: 'reconnecting…',
  offline: 'standing by',
};

const STATUS_DOT: Record<ConnectionStatus, string> = {
  live: 'bg-emerald-400',
  mock: 'bg-sky-400',
  connecting: 'bg-zinc-500',
  reconnecting: 'bg-amber-400',
  offline: 'bg-zinc-600',
};

const COUNT_LABEL: Record<Source, string> = {
  'CAPI Bridge': 'CAPI',
  'Spend → Sheets': 'Sheets',
  'Sample Automation': 'Samples',
};

function relativeTime(receivedAt: number): string {
  const seconds = Math.max(0, Math.floor((Date.now() - receivedAt) / 1000));
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

/**
 * The legibility layer: proves the graphic is live production traffic, not a
 * loop. Relative times re-render from one 1s interval scoped to this small
 * component.
 *
 * A11y: the event list is aria-live="off" — one update every few seconds
 * would be screen-reader spam (per WAI guidance for stock-ticker UI). Only
 * the rarely-changing connection pill is a polite live region.
 */
export function Ticker({ events, status, counts }: TickerProps) {
  const [, tick] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const recent = events.slice(0, 3);

  return (
    <div className="pointer-events-none absolute bottom-6 left-6 z-10 font-mono text-xs">
      <div
        role="status"
        aria-live="polite"
        className="flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-1.5 backdrop-blur"
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]} ${
            status === 'live' || status === 'mock' ? 'animate-pulse' : ''
          }`}
        />
        <span className="text-zinc-400">{STATUS_LABEL[status]}</span>
        {(status === 'live' || status === 'mock') && (
          <span className="text-zinc-600">
            {(Object.keys(counts) as Source[])
              .map((s) => `${COUNT_LABEL[s]} ${counts[s]}`)
              .join(' · ')}
          </span>
        )}
      </div>

      <div aria-live="off" className="mt-2 space-y-1">
        <h2 className="sr-only">Recent automation events</h2>
        {recent.map((event) => (
          <p key={event.seq} className="text-zinc-500">
            <span className="text-zinc-300">{event.event_type}</span>
            {' — '}
            {event.source}
            {' — '}
            {relativeTime(event.receivedAt)}
          </p>
        ))}
      </div>
    </div>
  );
}
