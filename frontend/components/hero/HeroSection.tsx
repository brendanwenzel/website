import HeroVisual from './HeroVisual';

/**
 * Server component — the page's first paint. Layer stack:
 *   0. static radial-gradient backdrop (always painted: the WebGL placeholder
 *      AND the calm "offline" look)
 *   1. client-only WebGL visual, streamed in after hydration
 *   2. scrim for text contrast
 *   3. server-rendered headline + single CTA (the LCP element)
 *
 * The canvas is absolutely positioned inside a box whose size never depends
 * on it — zero layout shift by construction. h-svh avoids the mobile URL-bar
 * resize jump.
 */
export function HeroSection() {
  return (
    <section className="relative h-svh min-h-[560px] overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_40%,_#122031_0%,_#09090b_70%)]" />
      <div className="absolute inset-0">
        <HeroVisual />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/85 via-zinc-950/35 to-transparent" />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6">
        <p className="font-mono text-sm text-emerald-400/80">production systems · live</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
          Marketing systems that run while you sleep.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-400">
          Media buying, social commerce, and the engineering to automate it.
          16+ years across TikTok, Amazon, YouTube, Meta, and Shopify.
        </p>
        <a
          href="/contact"
          className="mt-8 w-fit rounded-md bg-emerald-500 px-6 py-3 font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
        >
          Work with me
        </a>
      </div>
    </section>
  );
}
