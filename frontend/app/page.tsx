import Link from 'next/link';

import { ExpertiseCards, type ExpertiseCard } from '@/components/hero/ExpertiseCards';
import { HeroBackdrop, HeroSection } from '@/components/hero/HeroSection';

// Each card is paired with one node of the hero diagram (index and label
// from NODES in lib/nodes-config.ts). On the full tier the scroll camera
// features that node while its card is active. Accent classes are the
// Tailwind tokens from globals.css and are spelled out so the scanner
// generates them.
const EXPERTISE: ExpertiseCard[] = [
  {
    // CAPI Bridge sends purchase events back to the ad platforms.
    node: 0,
    nodeLabel: 'capi-bridge',
    title: 'Media Buying & Social Commerce',
    titleClass: 'text-emerald-400',
    activeBorderClass: 'data-[active=true]:border-accent-capi',
    activeLabelClass: 'group-data-[active=true]:text-accent-capi',
    activeDotClass: 'group-data-[active=true]:bg-accent-capi',
    revealClass: 'reveal reveal-1',
    description:
      "Expert in leveraging platforms like TikTok, Amazon, and YouTube to drive sales. With over 16 years of experience, I've managed millions in ad spend across multiple platforms with proven ROI.",
    href: '/services/media-buying',
  },
  {
    // Spend to Sheets is custom reporting plumbing.
    node: 1,
    nodeLabel: 'spend-sheets',
    title: 'Technical Marketing & Development',
    titleClass: 'text-sky-400',
    activeBorderClass: 'data-[active=true]:border-accent-spend',
    activeLabelClass: 'group-data-[active=true]:text-accent-spend',
    activeDotClass: 'group-data-[active=true]:bg-accent-spend',
    revealClass: 'reveal reveal-2',
    description:
      'Skilled in Rust, Solidity, and web development. I bridge the gap between marketing and technology, creating custom solutions that drive results for e-commerce and blockchain projects.',
    href: '/services/web-development',
  },
  {
    // Sample Automation gets product to creators, which is how a shop grows.
    node: 2,
    nodeLabel: 'sample-automation',
    title: 'E-Commerce & Growth Strategy',
    titleClass: 'text-amber-400',
    activeBorderClass: 'data-[active=true]:border-accent-sample',
    activeLabelClass: 'group-data-[active=true]:text-accent-sample',
    activeDotClass: 'group-data-[active=true]:bg-accent-sample',
    revealClass: 'reveal reveal-3',
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
      {/* Top of the page: the node graph is the backdrop for the hero AND
          Expertise. overflow-clip (not hidden) clips the oversized backdrop
          without creating a scroll container, which would break its sticky
          canvas. isolate keeps the backdrop's layers under the header. */}
      <div className="relative isolate overflow-clip">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-zinc-950"
        />
        <HeroSection />
        <HeroBackdrop />

        <section data-journey-section="" className="relative mx-auto max-w-6xl px-6 py-24">
          <h2 className="w-fit text-3xl font-semibold tracking-tight text-zinc-50">
            My Expertise
          </h2>
          <ExpertiseCards cards={EXPERTISE} />
        </section>
      </div>

      <section className="border-t border-zinc-900 bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="reveal max-w-3xl">
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
              I&apos;ve generated millions in revenue for my clients. The diagram at the top
              of this page shows three systems I run, and the events moving through it are a
              simulation of their activity.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-900">
        <div className="reveal mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-20 sm:flex-row sm:items-center sm:justify-between">
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
