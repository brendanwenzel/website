import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/PageHeader';
import { HUB_COLOR, NODES } from '@/lib/nodes-config';

import styles from './services.module.css';

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
    node: NODES[2],
    description:
      'Strategic planning, campaign analysis, and growth roadmaps. Data-driven, ROI-focused — including a 3-year engagement that 4x’d monthly revenue.',
  },
  {
    href: '/services/media-buying',
    title: 'Media Buying',
    accent: 'text-emerald-400',
    node: NODES[0],
    description:
      'TikTok, Amazon, YouTube, Meta, and Google campaigns run with systematic methodologies. Millions in managed spend with proven ROAS.',
  },
  {
    href: '/services/web-development',
    title: 'Web Development',
    accent: 'text-sky-400',
    node: NODES[1],
    description:
      'Shopify, Rust backends, Solidity smart contracts, and marketing-tech integration — solutions that drive business results, not just demos.',
  },
];

// Header nodes in hero order (capi-bridge, spend-sheets, sample-automation),
// each linking to the service that carries its accent.
const HEADER_NODES = NODES.map((node) => {
  const service = SERVICES.find((s) => s.node === node)!;
  return { accent: node.color, label: node.label, href: service.href, name: service.title };
});

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <PageHeader
        accent={HUB_COLOR}
        label="hub"
        nodes={HEADER_NODES}
        title="Services"
        intro="Three ways to work together — strategy, execution, or the engineering underneath it all."
      />
      <div className="grid gap-8 md:grid-cols-3">
        {SERVICES.map(({ href, title, accent, description, node }) => (
          <Link
            key={href}
            href={href}
            style={{ '--card-accent': node.color } as React.CSSProperties}
            className={`${styles.card} group rounded-lg border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700 hover:bg-zinc-900/70`}
          >
            <h2 className={`text-lg font-medium ${accent}`}>{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{description}</p>
            <span className="mt-4 inline-block font-mono text-xs text-zinc-400 transition-colors group-hover:text-zinc-300">
              Details →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
