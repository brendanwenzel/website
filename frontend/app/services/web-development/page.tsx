import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/site/PageHeader';
import { Prose } from '@/components/site/Prose';

export const metadata: Metadata = {
  title: 'Web Development',
  description:
    'Shopify, Rust backends, Solidity smart contracts, and marketing-tech integration — web solutions built to drive business results.',
};

export default function WebDevelopmentPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <PageHeader
        title="Web Development"
        lead="I combine technical expertise with marketing knowledge to build web solutions that don't just look good but drive business results."
      />
      <Prose>
        <h2>Development Skills</h2>
        <p>I offer development services in multiple technologies:</p>
        <ul>
          <li>
            <strong>E-commerce</strong>: Shopify development and optimization
          </li>
          <li>
            <strong>Blockchain</strong>: Smart contract development using Solidity
          </li>
          <li>
            <strong>Backend</strong>: Server-side programming with Rust and other languages
          </li>
          <li>
            <strong>Custom Solutions</strong>: SaaS development and custom software
          </li>
          <li>
            <strong>Marketing Tech</strong>: Integration of analytics and marketing tools
          </li>
        </ul>

        <h2>Client Success Stories</h2>
        <h3>Blockchain Recovery Case</h3>
        <p>
          I used my technical skills with ethers.js and Hardhat to recover over $2,000 in
          liquidity that had been locked by a token developer during a rug pull. By analyzing the
          blockchain transactions and creating a custom solution, I was able to recover funds
          that would have otherwise been lost.
        </p>
        <h3>E-commerce Optimization</h3>
        <p>
          For multiple e-commerce clients, I&apos;ve implemented technical solutions that have
          significantly improved performance:
        </p>
        <ul>
          <li>Created cart upgrade offers that added $52.63 per checkout</li>
          <li>Developed bundle strategies that maintained profit while improving conversion</li>
          <li>Implemented technical solutions to improve site speed and user experience</li>
        </ul>

        <h2>My Technical Approach</h2>
        <p>My approach to development is pragmatic and results-focused:</p>
        <ol>
          <li>
            <strong>Understand the Business Goals</strong>: Every technical solution starts with
            understanding what problem we&apos;re solving
          </li>
          <li>
            <strong>Build for Results</strong>: Focus on creating solutions that directly impact
            key business metrics
          </li>
          <li>
            <strong>Integrate Marketing &amp; Tech</strong>: Bridge the gap between technical
            implementation and marketing strategy
          </li>
          <li>
            <strong>Measure &amp; Optimize</strong>: Continuous improvement based on data and
            performance
          </li>
        </ol>

        <h2>Who This Is For</h2>
        <p>My web development services are ideal for:</p>
        <ul>
          <li>E-commerce businesses looking to optimize their online stores</li>
          <li>Companies exploring blockchain technologies and Web3 applications</li>
          <li>Businesses requiring custom software solutions with marketing integration</li>
          <li>
            Startups and established companies needing technical expertise combined with
            marketing knowledge
          </li>
        </ul>

        <h2>Let&apos;s Create Something Together</h2>
        <p>
          Need a technical partner who understands both code and commerce?{' '}
          <Link href="/contact">Contact me</Link> to discuss your project.
        </p>
      </Prose>
    </div>
  );
}
