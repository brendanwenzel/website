'use client';

import Link from 'next/link';

import { useJourneyActive } from '@/hooks/useJourney';

export interface ExpertiseCard {
  title: string;
  description: string;
  href: string;
  /** Index into NODES (lib/nodes-config.ts) and that node's label. */
  node: number;
  nodeLabel: string;
  /** Literal Tailwind classes, kept in page.tsx so the scanner sees them. */
  titleClass: string;
  activeBorderClass: string;
  activeLabelClass: string;
  activeDotClass: string;
  revealClass: string;
}

/**
 * The one client component below the hero. It is still prerendered, so the
 * cards are in the HTML; the only client state is which card the camera
 * journey is on. Without a journey (lite, static, paused, narrow) `active`
 * stays -1 and this renders exactly what the server sent.
 *
 * Imports nothing from three.js: that code stays in the lazy hero chunk.
 */
export function ExpertiseCards({ cards }: { cards: ExpertiseCard[] }) {
  const active = useJourneyActive();

  return (
    <div className="mt-10 grid gap-8 md:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          data-journey-card=""
          data-journey-node={card.node}
          data-active={active === card.node ? 'true' : undefined}
          className={`group rounded-lg border border-zinc-800 bg-zinc-900/90 p-6 transition-colors duration-300 hover:border-zinc-700 hover:bg-zinc-900 ${card.activeBorderClass} ${card.revealClass}`}
        >
          <span
            className={`flex items-center gap-2 font-mono text-[11px] tracking-wider text-zinc-400 transition-colors duration-300 ${card.activeLabelClass}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full bg-zinc-600 transition-colors duration-300 ${card.activeDotClass}`}
            />
            {card.nodeLabel}
          </span>
          <h3 className={`mt-3 text-lg font-medium ${card.titleClass}`}>{card.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{card.description}</p>
          <span className="mt-4 inline-block font-mono text-xs text-zinc-400 transition-colors group-hover:text-zinc-300">
            Learn more →
          </span>
        </Link>
      ))}
    </div>
  );
}
