import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/site/PageHeader';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Marketing consulting, media buying, and web development services from Brendan Wenzel — Director of Social Commerce.',
};

const SERVICES = [
  {
    href: '/services/marketing-consulting',
    title: 'Marketing Consulting',
    accent: 'text-amber-400',
    description:
      'Strategic planning, campaign analysis, and growth roadmaps. Data-driven, ROI-focused — including a 3-year engagement that 4x’d monthly revenue.',
  },
  {
    href: '/services/media-buying',
    title: 'Media Buying',
    accent: 'text-emerald-400',
    description:
      'TikTok, Amazon, YouTube, Meta, and Google campaigns run with systematic methodologies. Millions in managed spend with proven ROAS.',
  },
  {
    href: '/services/web-development',
    title: 'Web Development',
    accent: 'text-sky-400',
    description:
      'Shopify, Rust backends, Solidity smart contracts, and marketing-tech integration — solutions that drive business results, not just demos.',
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <PageHeader
        title="Services"
        lead="Three ways to work together — strategy, execution, or the engineering underneath it all."
      />
      <div className="grid gap-8 md:grid-cols-3">
        {SERVICES.map(({ href, title, accent, description }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-lg border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700 hover:bg-zinc-900/70"
          >
            <h2 className={`text-lg font-medium ${accent}`}>{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{description}</p>
            <span className="mt-4 inline-block font-mono text-xs text-zinc-500 transition-colors group-hover:text-zinc-300">
              Details →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
