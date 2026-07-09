import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/site/PageHeader';
import { Prose } from '@/components/site/Prose';

export const metadata: Metadata = {
  title: 'Marketing Consulting',
  description:
    'Strategic marketing consulting from a 16+ year practitioner: strategic planning, campaign analysis, performance optimization, and growth strategy.',
};

export default function MarketingConsultingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <PageHeader
        title="Marketing Consulting"
        lead="As a seasoned marketing consultant with over 16 years of experience, I provide strategic guidance to help businesses grow their online presence and increase revenue."
      />
      <Prose>
        <h2>My Approach</h2>
        <p>
          I take a data-driven approach to marketing consulting, focusing on measurable results
          and ROI. My consulting services include:
        </p>
        <ul>
          <li>
            <strong>Strategic Planning</strong>: Developing comprehensive marketing strategies
            aligned with your business goals
          </li>
          <li>
            <strong>Campaign Analysis</strong>: Evaluating existing campaigns and providing
            actionable recommendations
          </li>
          <li>
            <strong>Performance Optimization</strong>: Identifying opportunities to improve
            marketing performance
          </li>
          <li>
            <strong>Growth Strategy</strong>: Creating roadmaps for sustainable business growth
          </li>
        </ul>

        <h2>Success Story</h2>
        <p>
          In a recent three-year contract (2020–2023), I was directly accountable for generating
          $4.3 million in sales, helping to elevate the organization&apos;s average monthly
          revenue from $58k to $256k — a four-fold increase that set new benchmarks for the
          business.
        </p>

        <h2>Who I Work With</h2>
        <p>I specialize in working with:</p>
        <ul>
          <li>E-commerce brands looking to scale</li>
          <li>Real estate investors</li>
          <li>CPG companies (especially in the startup phase)</li>
          <li>Digital businesses seeking to optimize their marketing efforts</li>
        </ul>

        <h2>Let&apos;s Connect</h2>
        <p>
          Interested in working together? <Link href="/contact">Contact me</Link> to discuss how
          I can help your business grow.
        </p>
      </Prose>
    </div>
  );
}
