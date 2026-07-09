# brendanwenzel.com — live-telemetry personal site

Two deployables, one repo, one interface between them.

```
┌─────────────────────────── Hetzner box ───────────────────────────┐
│                                                                    │
│  capi-bridge ─┐                                                    │
│  spend-sheets ├─▶ journald ─▶ journalctl -f -o json                │
│  sample-auto ─┘                    │                               │
│                                    ▼                               │
│                     backend/ (Rust, axum)                          │
│                     allowlist sanitizer  ◀── security boundary     │
│                     ring buffer + broadcast                        │
│                                    │  GET /events (SSE)            │
│                                    ▼                               │
│                     Caddy — HTTPS, reverse proxy                   │
│                     telemetry.brendanwenzel.com                    │
└────────────────────────────────────│───────────────────────────────┘
                                     │  text/event-stream, CORS-locked
                                     ▼
┌─────────────────────────── Vercel ─────────────────────────────────┐
│  frontend/ (Next.js 15)                                            │
│  EventSource ─▶ useTelemetry() ─▶ r3f WebGL hero (pulses + ticker) │
│  https://www.brendanwenzel.com                                     │
└────────────────────────────────────────────────────────────────────┘
```

## The data path

1. **journald** — the three production services (`capi-bridge`, `spend-sheets`,
   `sample-automation`) log structured event lines (`EVENT=<token> ...`) to the
   systemd journal alongside their normal (sensitive) logs.
2. **Rust sanitizer** (`backend/src/sanitizer.rs`) — tails the journal, parses each
   line, and applies an **allowlist-only, default-deny** transform. Raw log lines
   contain order IDs, dollar amounts, brand names, and emails; none of that can
   pass the boundary because the output is *constructed*, never copied through.
3. **SSE** — survivors are broadcast to all connected clients on `GET /events`,
   with the last 50 events replayed on connect.
4. **Caddy** — terminates HTTPS for `telemetry.brendanwenzel.com` and reverse-
   proxies to the backend on loopback. CORS is enforced in the app, locked to a
   single origin.
5. **Vercel EventSource** — the site's `useTelemetry()` hook consumes the stream.
6. **r3f hero** — each event fires a pulse from the matching source node in the
   WebGL scene; a live ticker shows the event type, source, and relative time.

## The contract

The output event JSON is the **single interface** between the halves. Defined in
`backend/src/sanitizer.rs` (`SanitizedEvent`) and mirrored in
`frontend/lib/telemetry-types.ts` (`TelemetryEvent`); the shape is pinned by a
unit test on the Rust side and a runtime validator on the TS side.

```json
{ "event_type": "Purchase Captured", "source": "CAPI Bridge", "timestamp": "2026-06-25T18:00:00Z" }
```

- `event_type` — display-safe label from the backend's allowlist table.
- `source` — one of `"CAPI Bridge"`, `"Spend → Sheets"`, `"Sample Automation"`.
- `timestamp` — ISO 8601 / RFC 3339, UTC.

Nothing else is ever present. If you add a field on the backend, add it to the
allowlist table, the Rust test, and `telemetry-types.ts` in the same change.

## Layout

| Path | What | Deploys to |
|---|---|---|
| `backend/` | Rust SSE telemetry server ([README](backend/README.md)) | Hetzner, systemd + Caddy |
| `frontend/` | Next.js 15 site ([README](frontend/README.md)) | Vercel — set **Root Directory = `frontend/`** |

## Build order / going live

The frontend is fully buildable and deployable **before** the backend exists:
with `NEXT_PUBLIC_TELEMETRY_URL` unset it runs in mock mode (fake events on an
interval). Going live is:

1. Deploy `backend/` on the Hetzner box (see `backend/README.md`, including the
   "before you expose this publicly" checklist).
2. Point `telemetry.brendanwenzel.com` at the box and add the Caddy site block.
3. Set `NEXT_PUBLIC_TELEMETRY_URL=https://telemetry.brendanwenzel.com/events` in
   Vercel and redeploy.
