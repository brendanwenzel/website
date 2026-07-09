import Link from 'next/link';

import { HeroSection } from '@/components/hero/HeroSection';

const EXPERTISE = [
  {
    title: 'Media Buying & Social Commerce',
    accent: 'text-emerald-400',
    description:
      "Expert in leveraging platforms like TikTok, Amazon, and YouTube to drive sales. With over 16 years of experience, I've managed millions in ad spend across multiple platforms with proven ROI.",
    href: '/services/media-buying',
  },
  {
    title: 'Technical Marketing & Development',
    accent: 'text-sky-400',
    description:
      'Skilled in Rust, Solidity, and web development. I bridge the gap between marketing and technology, creating custom solutions that drive results for e-commerce and blockchain projects.',
    href: '/services/web-development',
  },
  {
    title: 'E-Commerce & Growth Strategy',
    accent: 'text-amber-400',
    description:
      "Shopify expert with extensive experience in optimizing online stores. I've helped clients elevate monthly revenue from $58k to $256k through strategic digital marketing initiatives.",
    href: '/services/marketing-consulting',
  },
];

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Brendan Wenzel',
  jobTitle: 'Director of Social Commerce',
  url: 'https://www.brendanwenzel.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Newport Beach',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  sameAs: ['https://www.linkedin.com/in/brendanwenzel/'],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <HeroSection />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-50">My Expertise</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {EXPERTISE.map(({ title, accent, description, href }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-lg border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700 hover:bg-zinc-900/70"
            >
              <h3 className={`text-lg font-medium ${accent}`}>{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{description}</p>
              <span className="mt-4 inline-block font-mono text-xs text-zinc-500 transition-colors group-hover:text-zinc-300">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-900 bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-50">About</h2>
            <p className="mt-6 leading-relaxed text-zinc-400">
              I&apos;m a seasoned digital marketing professional specializing in social commerce,
              with extensive experience across TikTok, Amazon, and YouTube. Based in Newport
              Beach, California, I help brands leverage social platforms to drive sales and
              growth.
            </p>
            <p className="mt-4 leading-relaxed text-zinc-400">
              My core services include consulting, media buying, technical work, growth
              strategy, Shopify optimization, and creative. With over 16 years of experience,
              I&apos;ve generated millions in revenue for my clients — and the animation above
              isn&apos;t a loop: it&apos;s live telemetry from the production systems I run.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-900">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
              Ready to grow?
            </h2>
            <p className="mt-2 text-zinc-400">
              Let&apos;s talk about your campaigns, your stack, or both.
            </p>
          </div>
          <Link
            href="/contact"
            className="rounded-md bg-emerald-500 px-6 py-3 font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
