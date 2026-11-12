import HeroVisual from './HeroVisual';

const HERO_HEIGHT = 'min-h-[max(760px,100svh)]';

/**
 * Backdrop for the top of the home page (hero + Expertise). Rendered by
 * app/page.tsx as the first child of the wrapper that holds both sections.
 *
 *   0. static radial-gradient, hero sized (always painted: the WebGL
 *      placeholder AND the calm "offline" look)
 *   1. client-only visual, streamed in after hydration. On the full tier at
 *      desktop widths it is sticky and stays behind Expertise; otherwise it
 *      is hero sized and scrolls away with the hero.
 *
 * The box runs one viewport past the wrapper's bottom edge (the wrapper
 * clips it) so the sticky canvas is never pushed up by the end of its
 * container. Everything here is absolutely positioned: zero layout shift by
 * construction. pointer-events-none keeps clicks and text selection on the
 * content above it; the pause button opts back in.
 */
export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -bottom-[100svh]">
      <div className="absolute inset-x-0 top-0 h-[max(760px,100svh)] bg-[radial-gradient(ellipse_at_65%_40%,_#122031_0%,_#09090b_70%)]" />
      <HeroVisual />
    </div>
  );
}

/**
 * Server component: the page's first paint. A scrim for text contrast, then
 * the server-rendered headline and single CTA (the h1 is the LCP element).
 * The scrim fades out at the bottom so there is no hard edge where the
 * sticky canvas carries on into Expertise.
 */
export function HeroSection() {
  return (
    <section className={`relative ${HERO_HEIGHT}`}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/85 via-zinc-950/35 to-transparent [mask-image:linear-gradient(to_bottom,black_75%,transparent)]" />
      <div className={`pointer-events-none relative z-10 mx-auto flex ${HERO_HEIGHT} max-w-6xl flex-col justify-center px-6 pb-56 pt-32`}>
        <p className="pointer-events-auto w-fit font-mono text-sm text-emerald-400/80">
          three systems I run · simulated activity
        </p>
        <h1 className="pointer-events-auto mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
          Marketing systems that run while you sleep.
        </h1>
        <p className="pointer-events-auto mt-4 max-w-xl text-lg text-zinc-400">
          Media buying, social commerce, and the engineering to automate it.
          16+ years across TikTok, Amazon, YouTube, Meta, and Shopify.
        </p>
        <a
          href="/contact"
          className="pointer-events-auto mt-8 w-fit rounded-md bg-emerald-500 px-6 py-3 font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
        >
          Work with me
        </a>
      </div>
    </section>
  );
}
