/**
 * THE telemetry contract — the single interface between this site and the
 * Rust SSE backend (backend/src/sanitizer.rs, `SanitizedEvent`). Each SSE
 * `data:` line is exactly:
 *
 *   { "event_type": "Purchase Captured", "source": "CAPI Bridge", "timestamp": "2026-06-25T18:00:00Z" }
 *
 * If the backend adds a field, it must be added here (and to the backend's
 * allowlist + `no_pii_leaks` test) in the same change.
 */

export const SOURCES = ['CAPI Bridge', 'Spend → Sheets', 'Sample Automation'] as const;
export type Source = (typeof SOURCES)[number];

export interface TelemetryEvent {
  event_type: string;
  source: Source;
  timestamp: string; // ISO 8601 / RFC 3339, UTC
}

export type ConnectionStatus = 'mock' | 'connecting' | 'live' | 'reconnecting' | 'offline';

/** A telemetry event stamped on arrival with a client-side identity. */
export interface StampedEvent extends TelemetryEvent {
  /** Monotonically increasing — the pulse trigger key for the 3D scene. */
  seq: number;
  /** Date.now() at arrival, for relative-time display in the ticker. */
  receivedAt: number;
}

/**
 * The backend emits "Spend → Sheets" with a real arrow; tolerate the ASCII
 * spelling so a backend typo degrades to a working event, not a dead pulse.
 */
const SOURCE_ALIASES: Record<string, Source> = {
  'Spend -> Sheets': 'Spend → Sheets',
};

/**
 * Parse and validate one SSE `data:` payload. Returns null for anything that
 * doesn't match the contract — garbage on the stream must never break the
 * hero, so unknown events are dropped silently.
 */
export function parseTelemetryEvent(raw: string): TelemetryEvent | null {
  let o: unknown;
  try {
    o = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof o !== 'object' || o === null) return null;
  const e = o as Record<string, unknown>;
  if (typeof e.event_type !== 'string' || typeof e.timestamp !== 'string') return null;

  if (typeof e.source !== 'string') return null;
  const source = SOURCE_ALIASES[e.source] ?? e.source;
  if (!(SOURCES as readonly string[]).includes(source)) return null;

  return { event_type: e.event_type, source: source as Source, timestamp: e.timestamp };
}
