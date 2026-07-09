# telemetry-backend

Rust SSE server that tails the systemd journal for the production pipeline
units, pushes each line through an **allowlist-only sanitizer**, and streams
the survivors to browsers on `GET /events`. Runs on the Hetzner box behind
Caddy; consumed cross-origin by the Next.js site on Vercel.

Every emitted event is exactly:

```json
{ "event_type": "Purchase Captured", "source": "CAPI Bridge", "timestamp": "2026-06-25T18:00:00Z" }
```

This shape is the single interface with the frontend
(`frontend/lib/telemetry-types.ts`) and is pinned by the `no_pii_leaks` test.

## How the allowlist works

`src/sanitizer.rs` is the entire security boundary. The policy is two const
tables at the top of that file:

- `EVENT_LABELS` — recognized event tokens → display labels. A journal line
  passes only if its `MESSAGE` **begins with** `EVENT=<token>` and the token
  is an exact key in this table. Prose that merely mentions a token never
  matches; there is no substring matching.
- `UNIT_NAMES` — recognized `_SYSTEMD_UNIT` values → friendly source names.
  Events from any other unit are dropped, even with a valid token.

Everything else is default-deny: unparseable JSON, missing or non-UTF-8
`MESSAGE` (journald encodes those as byte arrays), unknown token, unknown
unit, or a bad `__REALTIME_TIMESTAMP` all drop the line. The output struct is
constructed from scratch — `event_type` and `source` are `&'static str`, so
they *cannot* hold a runtime string from the journal. `MESSAGE` is never
stored, forwarded, or logged.

**To add an event type:** add one row to `EVENT_LABELS`, make the emitting
service log `EVENT=<token> ...` at the start of a line, and review that the
new label itself contains nothing sensitive.

**Emitting-side contract:** each of the three services logs a single line per
event, e.g.

```
EVENT=purchase_captured order=ORD-8842 amount=$149.99
```

Everything after the token is ignored by the sanitizer, so services can keep
logging useful detail for their own journals.

## Run locally

```sh
cargo test                                       # the security boundary is test-gated
ALLOWED_ORIGIN=http://localhost:8000 cargo run   # ALLOWED_ORIGIN is required, no default
curl -N http://127.0.0.1:8088/events             # raw stream (curl ignores CORS)
```

For a browser test, serve `test.html` (EventSource is CORS-checked, so it must
be served from the allowed origin):

```sh
python3 -m http.server 8000    # from this directory
# then open http://localhost:8000/test.html
```

Without the three real units running you'll see no events. On a systemd box
you can prove default-deny with `systemd-cat -t test echo "EVENT=purchase_captured"`
— it is dropped (unknown unit). For a full local pipeline, put a fake
`journalctl` script earlier on `PATH` that prints journald-style JSON lines.

### Configuration (env)

| Var | Default | Notes |
|---|---|---|
| `UNITS` | `capi-bridge,spend-sheets,sample-automation` | comma-separated, no `.service` suffix |
| `BIND_ADDR` | `127.0.0.1:8088` | keep on loopback; Caddy exposes it |
| `BUFFER_SIZE` | `50` | ring buffer replayed to each new client |
| `ALLOWED_ORIGIN` | — **required** | exact origin, e.g. `https://www.brendanwenzel.com`. The server refuses to start without it: a forgotten var must fail loudly, never fall back to something permissive. |

## Behavior notes

- **Replay**: on connect a client receives the last `BUFFER_SIZE` sanitized
  events, then live events. Snapshot and subscription are taken under one
  lock, so there is no gap or duplicate between them.
- **Self-healing**: if `journalctl` dies or fails to spawn, it is respawned
  with exponential backoff (1s → 30s cap, reset after a 60s stable run).
  `-n 0` means a respawn never re-emits old entries; events during a crash
  window are lost, which is acceptable for a status ticker (a
  `--cursor-file` would close that gap — future work).
- **Slow clients**: a client that falls > 256 events behind skips the gap and
  keeps streaming (logged as a warning).
- **Keep-alive**: SSE comment frame every 15s, under common 30–60s NAT/proxy
  idle timeouts.

## Deploy (Hetzner)

```sh
cargo build --release
sudo install -m 755 target/release/telemetry-backend /usr/local/bin/
sudo install -m 644 deploy/telemetry-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now telemetry-backend
journalctl -u telemetry-backend -f      # watch it come up
```

Then add `deploy/Caddyfile.snippet` to the Caddyfile and reload Caddy. The
service unit's `SupplementaryGroups=systemd-journal` line is what lets the
spawned `journalctl` read the journal — see the comments in the unit file.

## Before you expose this publicly — sanitizer checklist

- [ ] Every row in `EVENT_LABELS` reviewed: no label contains an amount, ID,
      brand, or name.
- [ ] `cargo test` green — especially `no_pii_leaks`, `default_deny_prose`,
      and `default_deny_unknown_token`.
- [ ] `grep -rn MESSAGE src/` shows it read in exactly one place
      (`sanitizer.rs`), only for leading-token extraction.
- [ ] No log statement prints a raw journal line; production `RUST_LOG` is
      `info` (dropped lines are not logged at any level).
- [ ] Connect `test.html` against the real journal on the server and eyeball
      10 minutes of output.
- [ ] `ALLOWED_ORIGIN` is the production origin; `BIND_ADDR` is still
      `127.0.0.1` (only Caddy is exposed).
- [ ] `systemd-cat -t test echo "EVENT=purchase_captured"` from an unlisted
      unit produces nothing on the stream.
