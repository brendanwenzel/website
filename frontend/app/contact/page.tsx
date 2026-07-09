import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/site/PageHeader';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Brendan Wenzel about media buying, marketing consulting, or web development.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <PageHeader
        title="Contact"
        lead="The fastest way to reach me is email. Tell me what you're working on — campaigns, stack, or both — and I'll get back to you."
      />
      <div className="flex flex-col gap-4 sm:flex-row">
        <a
          href="mailto:contact@brendanwenzel.net"
          className="rounded-md bg-emerald-500 px-6 py-3 text-center font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
        >
          contact@brendanwenzel.net
        </a>
        <a
          href="https://www.linkedin.com/in/brendanwenzel/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-zinc-700 px-6 py-3 text-center font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
        >
          Connect on LinkedIn
        </a>
      </div>
      <div className="mt-16 grid gap-6 text-sm text-zinc-400 sm:grid-cols-3">
        <div>
          <h2 className="font-medium text-zinc-200">Media buying</h2>
          <p className="mt-2">
            Scaling paid acquisition on TikTok, Amazon, YouTube, Meta, and Google.{' '}
            <Link href="/services/media-buying" className="text-emerald-400 hover:text-emerald-300">
              Details
            </Link>
          </p>
        </div>
        <div>
          <h2 className="font-medium text-zinc-200">Consulting</h2>
          <p className="mt-2">
            Strategy, campaign analysis, and growth roadmaps.{' '}
            <Link
              href="/services/marketing-consulting"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Details
            </Link>
          </p>
        </div>
        <div>
          <h2 className="font-medium text-zinc-200">Development</h2>
          <p className="mt-2">
            Shopify, Rust backends, and marketing-tech integration.{' '}
            <Link
              href="/services/web-development"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Details
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
