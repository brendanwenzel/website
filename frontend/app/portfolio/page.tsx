import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/site/PageHeader';
import { Prose } from '@/components/site/Prose';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    "Notable projects from Brendan Wenzel's 16+ year career: founding and exiting Cute n' Country, $4.3M in client revenue growth, and technical marketing projects.",
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <PageHeader
        title="Portfolio"
        lead="Over my 16+ year career, I've helped numerous clients achieve significant growth through strategic digital marketing initiatives. Here are some of my most notable projects and achievements."
      />
      <Prose>
        <h2>Cute n&apos; Country (2013–2020)</h2>
        <p>
          <strong>Founder</strong>
        </p>
        <p>
          Founded in the fall of 2013, Cute n&apos; Country tapped into a niche market of country
          lifestyle enthusiasts.
        </p>
        <h3>Key Achievements</h3>
        <ul>
          <li>Scaled from first sale to six-figure profit months within 6 months</li>
          <li>Managed nearly $3 million in ad spend across Google, Pinterest, and Facebook</li>
          <li>Grew an aggregated following of over 3 million subscribers</li>
          <li>Successfully exited through acquisition in May 2020</li>
        </ul>
        <h3>Growth Strategy</h3>
        <p>
          My approach combined organic social media growth with strategic paid advertising to
          build a passionate community around the brand. By focusing on relatable content and
          shareable memes, we created strong brand resonance with our core audience of
          middle-aged women interested in country lifestyle.
        </p>

        <h2>Client Success: Revenue Growth (2020–2023)</h2>
        <p>
          <strong>Marketing Consultant</strong>
        </p>
        <p>
          During a three-year contract, I was directly responsible for generating substantial
          revenue growth for a client.
        </p>
        <h3>Key Achievements</h3>
        <ul>
          <li>Generated $4.3 million in total sales</li>
          <li>Increased average monthly revenue from $58k to $256k (4x growth)</li>
          <li>Set new performance benchmarks for the business</li>
        </ul>

        <h2>Facebook Advertising Optimization (2023)</h2>
        <p>
          <strong>Senior Media Buyer</strong>
        </p>
        <p>
          For a client with an established Facebook ad account, I optimized and scaled their
          campaigns.
        </p>
        <h3>Key Achievements</h3>
        <ul>
          <li>Scaled daily spend from $1,300/day to $5,000/day in just 22 days</li>
          <li>Simultaneously improved two core KPIs, enhancing both volume and efficiency</li>
          <li>Implemented systematic media buying strategies that delivered consistent results</li>
        </ul>

        <h2>Technical Projects</h2>
        <h3>Blockchain Recovery Solution</h3>
        <p>
          Using ethers.js and Hardhat, I created a solution to recover over $2,000 of liquidity
          locked by a token developer in a rug pull.
        </p>
        <h3>E-commerce Conversion Optimization</h3>
        <p>
          Implemented cart upgrade offers that added $52.63 per checkout by optimizing product
          bundles and user experience.
        </p>

        <h2>Current Projects</h2>
        <p>I&apos;m actively working with:</p>
        <ul>
          <li>Two real estate investors training people on buying distressed properties</li>
          <li>A CPG beverage company in their startup phase</li>
          <li>
            Various clients on social commerce optimization for TikTok, Amazon, and YouTube
            platforms
          </li>
        </ul>

        <hr />
        <p>
          <em>
            Interested in working together? <Link href="/contact">Contact me</Link> to discuss
            your project and how I can help grow your business.
          </em>
        </p>
      </Prose>
    </div>
  );
}
