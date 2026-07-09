# brendanwenzel.com — frontend

Next.js 15 (App Router) site with a live-telemetry WebGL hero: real production
events from the Rust SSE backend (`../backend`) fire pulses in a
react-three-fiber scene. Everything outside the hero is static server
components.

## Local dev

```sh
npm install
cp env.example .env.local    # optional — with no env at all you get mock mode
npm run dev
```

### Mock mode (default)

If `NEXT_PUBLIC_TELEMETRY_URL` is **unset**, `useTelemetry` emits fake events
on a 2.5–7s interval (`lib/mock-telemetry.ts`) and the ticker is labeled
`simulated`. This is deliberate: the site is fully developable and deployable
on Vercel before the backend exists. Going live is just setting the env var
and redeploying.

### Testing the real EventSource path

```sh
node scripts/mock-sse.mjs        # contract-shaped SSE on :8787
NEXT_PUBLIC_TELEMETRY_URL=http://localhost:8787/events npm run dev
```

Kill the script mid-session: the ticker shows `reconnecting…` and the scene
keeps its calm idle animation (never an error state). Restart it and the
native EventSource retry reconnects. To eyeball the wire format the Rust
backend must match: `curl -N http://localhost:8787/events`.

## The telemetry contract

Defined once in `lib/telemetry-types.ts`, mirrored by the backend's
`SanitizedEvent` (see `../README.md`):

```json
{ "event_type": "Purchase Captured", "source": "CAPI Bridge", "timestamp": "2026-06-25T18:00:00Z" }
```

`parseTelemetryEvent` validates every incoming message and silently drops
anything off-contract — garbage on the stream can't break the hero.

## Architecture notes

- **Hero**: `components/hero/HeroSection.tsx` is a server component with a
  static gradient + server-rendered headline (the LCP element). The WebGL
  scene loads via `dynamic(..., { ssr: false })` inside the `HeroVisual`
  client shim (a Next 15 requirement — `ssr:false` is illegal in server
  components) and fades in over the gradient. Zero CLS: the canvas is
  absolutely positioned in a fixed-size box.
- **Tiers** (`lib/perf-tier.ts`, decided once on mount): `full` desktop,
  `lite` for touch/low-memory devices (fewer particles, lower DPR), `static`
  for `prefers-reduced-motion` / very weak devices / WebGL failure (SVG
  diagram, text-only updates). The ticker is live in every tier.
- **Pausing**: rendering stops entirely (`frameloop="never"`) when the tab is
  hidden or the hero is scrolled off-screen (`hooks/useHeroActive.ts`).

## Env

See `env.example`. Note `NEXT_PUBLIC_*` values are inlined at **build** time;
changing them on Vercel requires a redeploy.

## Deploy (Vercel)

1. Import the repo; set **Root Directory = `frontend/`** (this is a monorepo).
2. Env: `NEXT_PUBLIC_TELEMETRY_URL` — omit until the backend is live, then
   `https://telemetry.brendanwenzel.com/events`.
3. Build command / output: defaults (`next build`).

Old `/docs/...` URLs 301 to the new routes (`next.config.ts`).

### Version pins worth knowing

- `@react-three/fiber@9` + `@react-three/drei@10` are required for React 19
  (fiber 8 is React 18 only).
- Tailwind v4: config lives in `app/globals.css` (`@theme`), no
  `tailwind.config.js`.
