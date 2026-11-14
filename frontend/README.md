# brendanwenzel.com frontend

Next.js 15 (App Router) site with a WebGL diagram of three systems Brendan
runs (CAPI Bridge, Spend to Sheets, Sample Automation) in a react-three-fiber
scene. Telemetry events fire pulses in it. The deployed site runs in mock
mode, so those events are simulated and the ticker says so; real events from
the Rust SSE backend (`../backend`) only flow once `NEXT_PUBLIC_TELEMETRY_URL`
is set.

On the home page the scene is the backdrop for the hero and the "My
Expertise" section (the camera journey, below). Everything else on the site
is static server components.

## Local dev

```sh
npm install
cp env.example .env.local    # optional: with no env at all you get mock mode
npm run dev
```

### Mock mode (default)

If `NEXT_PUBLIC_TELEMETRY_URL` is **unset**, `useTelemetry` emits fake events
on a 2.5 to 7s interval (`lib/mock-telemetry.ts`) and the ticker is labeled
`simulated`. Page copy has to agree with that: the hero eyebrow reads "three
systems I run · simulated activity" and the About block calls the event
stream a simulation. Do not describe the diagram as live production traffic
anywhere while mock mode is what ships. This is deliberate: the site is fully developable and deployable
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
anything off-contract, so garbage on the stream can't break the hero.

## Architecture notes

- **Hero**: `components/hero/HeroSection.tsx` is a server component with a
  static gradient and the server-rendered headline. The h1 is the LCP
  element and must stay that way. The WebGL scene loads via
  `dynamic(..., { ssr: false })` inside the `HeroVisual` client shim (a Next
  15 requirement: `ssr:false` is illegal in server components) and fades in
  over the gradient. Zero CLS: the backdrop and canvas are absolutely
  positioned (or sticky inside an absolutely positioned box) and never size
  anything in the flow.
- **Hero framing**: on the full tier `CameraRig` frames the resting graph
  in the space to the right of the hero copy column, so no node or label
  sits behind the headline. The column constants at the top of
  `CameraRig.tsx` mirror `HeroSection`; change them together. Windows too
  narrow for that keep the original centred pose, as does the lite tier.
  Below 768px, the hero copy stays in normal flow and the diagram has a
  reserved 520px section below it, including its controls and ticker. The
  280px visual cannot overlap the copy, including with larger text.
- **Backdrop layer**: `app/page.tsx` wraps the hero and the Expertise section
  in one `relative isolate overflow-clip` box. `HeroBackdrop` is the
  desktop backdrop and holds the gradient and the visual. On phones it
  follows the copy in normal document flow. It is `pointer-events-none`
  (only the pause button opts back in), so it never blocks clicks or text
  selection on the content above it. The Expertise cards carry a 90% scrim
  for text contrast over the canvas.
- **Camera journey** (approved by Brendan 2026-11-11; it replaces the old
  rule that everything outside the hero is a static server component). On
  the `full` tier at `md` widths and up, the canvas is sticky and stays
  behind Expertise. `hooks/useJourney.ts` maps scroll position to an active
  card; `components/hero/CameraRig.tsx` pans and dollies the camera (damped)
  so that card's node sits above the card row, clear of the card, the node brightens, and flow on
  its curve speeds up a little. Card to node mapping lives in `EXPERTISE` in
  `app/page.tsx`: Media Buying & Social Commerce is `capi-bridge`, Technical
  Marketing & Development is `spend-sheets`, E-Commerce & Growth Strategy is
  `sample-automation`. Past Expertise the canvas fades to zero and the render
  loop stops. On `lite`, on narrow widths, on `static`, when paused, and if
  WebGL fails, there is no journey: the visual is hero sized and scrolls away
  with the hero as before.
- **What is a client component now**: the hero visual (as before) and
  `components/hero/ExpertiseCards.tsx`, which subscribes to the active card.
  It is still prerendered, and it must not import anything that pulls in
  three.js (`lib/nodes-config.ts` does), so the 3D code stays in its lazy
  chunk. The heading, About block, CTA strip, header and footer remain
  server components.
- **Scroll reveals**: the cards, About block and CTA strip rise and fade in
  with CSS scroll-driven animation (`animation-timeline: view()`), in one
  commented block at the end of `app/globals.css`, inside `@supports`.
  Browsers without support just show the content. No JS involved.
- **Tiers** (`lib/perf-tier.ts`, decided once on mount): `full` desktop,
  `lite` for touch/low-memory devices (fewer particles, lower DPR), `static`
  for `prefers-reduced-motion` / very weak devices / WebGL failure (SVG
  diagram, text-only updates). The ticker updates in every tier. The hero
  must never look broken: connection trouble and WebGL failure both degrade
  to a calm diagram.
- **Pausing**: rendering stops entirely (`frameloop="never"`) when the tab is
  hidden, the canvas is off-screen, or the journey has faded it out
  (`hooks/useHeroActive.ts`). The pause button swaps in the static diagram
  and turns the journey off. The global `prefers-reduced-motion` rule in
  `globals.css` kills CSS animation; the three.js path uses the `static`
  tier.
- **Accent palette**: defined twice on purpose, in `app/globals.css`
  (`--color-accent-*`, used by the cards) and `lib/nodes-config.ts` (used by
  three.js, which CSS can't feed). Change both together.

## Env

See `env.example`. Note `NEXT_PUBLIC_*` values are inlined at **build** time;
changing them on Vercel requires a redeploy.

## Deploy (Vercel)

1. Import the repo; set **Root Directory = `frontend/`** (this is a monorepo).
2. Env: `NEXT_PUBLIC_TELEMETRY_URL`: omit until the backend is live, then
   `https://telemetry.brendanwenzel.com/events`.
3. Build command / output: defaults (`next build`).

Old `/docs/...` URLs 301 to the new routes (`next.config.ts`).

### Version pins worth knowing

- `@react-three/fiber@9` + `@react-three/drei@10` are required for React 19
  (fiber 8 is React 18 only).
- Tailwind v4: config lives in `app/globals.css` (`@theme`), no
  `tailwind.config.js`.
