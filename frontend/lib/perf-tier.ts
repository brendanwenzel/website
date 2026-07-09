/**
 * Render-tier detection, decided ONCE on mount of the client-only hero
 * subtree (no live switching, no hydration mismatch — the subtree is
 * ssr:false so this only ever runs in the browser).
 *
 *  - 'static': reduced motion or very weak device → SVG diagram, text-only
 *    event updates. Also the runtime fallback if WebGL fails.
 *  - 'lite':   real 3D but fewer particles, lower DPR, no parallax. Chosen
 *    for touch hardware (coarse pointer — actual phones/tablets, not just
 *    narrow windows) and low-memory devices.
 *  - 'full':   everything on.
 */

export type Tier = 'full' | 'lite' | 'static';

export function detectTier(): Tier {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static';

  // navigator.deviceMemory is Chromium-only; undefined = assume capable.
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (deviceMemory !== undefined && deviceMemory <= 2) return 'static';

  const coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (coarsePointer || (deviceMemory !== undefined && deviceMemory <= 4)) return 'lite';

  return 'full';
}
