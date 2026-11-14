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

  // R3F configures its renderer asynchronously, so a rejected WebGL context
  // can bypass the React error boundary. Choose the SVG before mounting Canvas
  // when this browser cannot create the WebGL2 context that Three.js requires.
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2', {
      antialias: false,
      powerPreference: 'low-power',
      alpha: true,
    });
    if (!context) return 'static';
    context.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    return 'static';
  }

  const coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (coarsePointer || (deviceMemory !== undefined && deviceMemory <= 4)) return 'lite';

  return 'full';
}

/**
 * The scroll camera journey runs only on the 'full' tier AND at widths where
 * the Expertise cards sit side by side (Tailwind `md`). Narrow windows and
 * the 'lite' tier keep the plain hero: the canvas scrolls away with it.
 */
export const JOURNEY_MIN_WIDTH_QUERY = '(min-width: 768px)';
