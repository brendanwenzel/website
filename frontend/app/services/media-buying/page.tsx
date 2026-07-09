import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/site/PageHeader';
import { Prose } from '@/components/site/Prose';

export const metadata: Metadata = {
  title: 'Media Buying',
  description:
    'Systematic, data-driven media buying across TikTok, Amazon, YouTube, Meta, and Google — millions in managed spend with proven ROAS.',
};

export default function MediaBuyingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <PageHeader
        title="Media Buying"
        lead="As a seasoned media buying professional with experience across multiple platforms, I help brands optimize their ad spend and maximize ROI through strategic campaign management."
      />
      <Prose>
        <h2>Platforms I Specialize In</h2>
        <ul>
          <li>
            <strong>TikTok</strong>: Leveraging TikTok&apos;s growing social commerce capabilities
          </li>
          <li>
            <strong>Amazon</strong>: Optimizing product visibility and sales through Amazon&apos;s
            advertising solutions
          </li>
          <li>
            <strong>YouTube</strong>: Creating compelling video ad campaigns that drive engagement
          </li>
          <li>
            <strong>Facebook/Instagram</strong>: Managing high-performance campaigns that deliver
            results
          </li>
          <li>
            <strong>Google Ads</strong>: Strategic keyword targeting and campaign optimization
          </li>
        </ul>

        <h2>My Media Buying Philosophy</h2>
        <p>
          My approach to media buying is systematic and data-driven. I&apos;ve developed
          proprietary methodologies like my &quot;5x20 method&quot; that consistently delivers
          results even under pressure. Through years of testing and optimization, I&apos;ve built
          reliable systems that:
        </p>
        <ul>
          <li>Lower downside risk while keeping upside potential</li>
          <li>Scale campaigns effectively when they&apos;re performing well</li>
          <li>Maintain consistent ROAS (Return on Ad Spend)</li>
          <li>Adapt quickly to platform changes and market conditions</li>
        </ul>

        <h2>Track Record</h2>
        <p>I&apos;ve personally managed millions in ad spend across multiple platforms:</p>
        <ul>
          <li>Helped clients achieve 4x revenue growth through strategic media buying</li>
          <li>Generated over $1 million in personal profit from Facebook campaigns</li>
          <li>Scaled accounts from $1,300/day to $5,000/day while improving core KPIs</li>
          <li>
            Successfully competed against &quot;big name gurus&quot; in head-to-head competitions
          </li>
        </ul>

        <h2>Ideal Clients</h2>
        <p>My media buying services are best suited for:</p>
        <ul>
          <li>E-commerce brands looking to scale customer acquisition</li>
          <li>Businesses with existing marketing funnels seeking optimization</li>
          <li>Companies with a minimum ad spend of $100/day</li>
          <li>Organizations ready to implement strategic, systematic approaches to media buying</li>
        </ul>

        <h2>Let&apos;s Work Together</h2>
        <p>
          Ready to transform your media buying strategy? <Link href="/contact">Contact me</Link>{' '}
          to discuss how I can help optimize your campaigns and drive growth.
        </p>
      </Prose>
    </div>
  );
}
