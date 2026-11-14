import type { Metadata } from 'next';
import Link from 'next/link';

import { CountUp } from '@/components/portfolio/CountUp';
import { RiseChart } from '@/components/portfolio/RiseChart';
import styles from '@/components/portfolio/timeline.module.css';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    "Notable projects from Brendan Wenzel's 16+ year career: founding and exiting Cute n' Country, $4.3M in client revenue growth, and technical marketing projects.",
};

type Accent = 'emerald' | 'sky' | 'amber' | 'grey';

function Station({
  accent,
  years,
  title,
  role,
  early = false,
  children,
}: {
  accent: Accent;
  years?: string;
  title: string;
  role?: string;
  early?: boolean;
  children: React.ReactNode;
}) {
  const reveal = early ? styles.revealEarly : styles.reveal;
  return (
    <section className={`${styles.station} ${styles[accent]} pb-20 last:pb-4 sm:pb-24`}>
      <span className={styles.rail} aria-hidden="true" />
      <span className={styles.railFill} aria-hidden="true" />
      <span className={styles.node} aria-hidden="true" />
      <header className={reveal}>
        {years ? (
          <p className={`${styles.eyebrow} font-mono text-xs uppercase tracking-widest`}>
            {years}
          </p>
        ) : null}
        <h2
          className={`text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl ${years ? 'mt-3' : ''}`}
        >
          {title}
        </h2>
        {role ? <p className="mt-2 font-medium text-zinc-200">{role}</p> : null}
      </header>
      {children}
    </section>
  );
}

function Para({ early = false, children }: { early?: boolean; children: React.ReactNode }) {
  return (
    <p
      className={`${early ? styles.revealEarly : styles.reveal} mt-5 max-w-2xl leading-relaxed text-zinc-300`}
    >
      {children}
    </p>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className={`${styles.reveal} mt-10 font-mono text-xs uppercase tracking-widest text-zinc-400`}
    >
      {children}
    </h3>
  );
}

function Point({ early = false, children }: { early?: boolean; children: React.ReactNode }) {
  return (
    <li
      className={`${early ? styles.revealEarly : styles.reveal} flex gap-3 leading-relaxed text-zinc-300 sm:col-span-2`}
    >
      <span
        className={`${styles.marker} mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full`}
        aria-hidden="true"
      />
      <span>{children}</span>
    </li>
  );
}

/** A claim from the page set as a tile: its text still reads as the original sentence. */
function Stat({
  as: Tag = 'li',
  wide = false,
  before,
  qualifier,
  figure,
  unit,
  after,
}: {
  as?: 'li' | 'p';
  wide?: boolean;
  before?: string;
  qualifier?: string;
  figure: React.ReactNode;
  unit?: string;
  after: string;
}) {
  return (
    <Tag
      className={`${styles.reveal} rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 ${wide ? 'sm:col-span-2' : ''}`}
    >
      {before ? <span className="block text-sm text-zinc-400">{before} </span> : null}
      <span className="mt-2 flex flex-wrap items-baseline gap-x-3 font-mono text-zinc-50">
        {qualifier ? <span className="text-base text-zinc-400">{qualifier} </span> : null}
        <span className="text-5xl font-medium tracking-tight sm:text-6xl">{figure}</span>
        {unit ? <span className="text-xl text-zinc-300"> {unit}</span> : null}
      </span>
      <span className="mt-3 block text-sm leading-relaxed text-zinc-300"> {after}</span>
    </Tag>
  );
}

const LIST = 'mt-5 grid gap-4 sm:grid-cols-2';

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <PageHeader
        variant="plain"
        title="Portfolio"
        intro="Over my 16+ year career, I've helped numerous clients achieve significant growth through strategic digital marketing initiatives. Here are some of my most notable projects and achievements."
      />
      <p className="mb-16 flex items-baseline gap-3 font-mono sm:mb-20">
        <span className="text-5xl font-medium tracking-tight text-zinc-50 sm:text-6xl">
          <CountUp value={16} suffix="+" />
        </span>
        <span className="text-sm uppercase tracking-widest text-zinc-400">year career</span>
      </p>

      <div>

        <Station accent="emerald" years="2013 to 2020" title="Cute n' Country" role="Founder">
          <Para>
            Founded in the fall of 2013, Cute n&apos; Country tapped into a niche market of
            country lifestyle enthusiasts.
          </Para>
          <SubHeading>Key achievements</SubHeading>
          <ul className={LIST}>
            <Point>Scaled from first sale to six-figure profit months within 6 months</Point>
            <Stat
              before="Managed"
              qualifier="nearly"
              figure={<CountUp value={3} prefix="$" />}
              unit="million"
              after="in ad spend across Google, Pinterest, and Facebook"
            />
            <Stat
              before="Grew an aggregated following of"
              qualifier="over"
              figure={<CountUp value={3} />}
              unit="million"
              after="subscribers"
            />
            <Point>Successfully exited through acquisition in May 2020</Point>
          </ul>
          <SubHeading>Growth strategy</SubHeading>
          <Para>
            My approach combined organic social media growth with strategic paid advertising to
            build a passionate community around the brand. By focusing on relatable content and
            shareable memes, we created strong brand resonance with our core audience of
            middle-aged women interested in country lifestyle.
          </Para>
        </Station>

        <Station
          accent="sky"
          years="2020 to 2023"
          title="Client success: revenue growth"
          role="Marketing Consultant"
        >
          <Para>
            During a three-year contract, I was directly responsible for generating substantial
            revenue growth for a client.
          </Para>
          <SubHeading>Key achievements</SubHeading>
          <ul className={LIST}>
            <Stat
              wide
              before="Generated"
              figure={<CountUp value={4.3} decimals={1} prefix="$" />}
              unit="million"
              after="in total sales"
            />
            <li className={`${styles.reveal} sm:col-span-2`}>
              <RiseChart
                measure="Average monthly revenue"
                startLabel="$58k"
                endLabel="$256k"
                startRatio={58 / 256}
                span="three-year contract"
                tag="4x growth"
                description="Line chart: average monthly revenue increased from $58k to $256k, 4x growth, during a three-year contract."
                caption="Increased average monthly revenue from $58k to $256k (4x growth)"
              />
            </li>
            <Point>Set new performance benchmarks for the business</Point>
          </ul>
        </Station>

        <Station
          accent="amber"
          years="2023"
          title="Facebook advertising optimization"
          role="Senior Media Buyer"
        >
          <Para>
            For a client with an established Facebook ad account, I optimized and scaled their
            campaigns.
          </Para>
          <SubHeading>Key achievements</SubHeading>
          <ul className={LIST}>
            <li className={`${styles.reveal} sm:col-span-2`}>
              <RiseChart
                measure="Daily spend"
                startLabel="$1,300/day"
                endLabel="$5,000/day"
                startRatio={1300 / 5000}
                span="22 days"
                description="Line chart: daily spend scaled from $1,300/day to $5,000/day in 22 days."
                caption="Scaled daily spend from $1,300/day to $5,000/day in just 22 days"
              />
            </li>
            <Point>
              Simultaneously improved two core KPIs, enhancing both volume and efficiency
            </Point>
            <Point>
              Implemented systematic media buying strategies that delivered consistent results
            </Point>
          </ul>
        </Station>

        <Station accent="grey" title="Technical projects">
          <SubHeading>Blockchain recovery solution</SubHeading>
          <Para>
            Using ethers.js and Hardhat, I created a solution to recover over $2,000 of liquidity
            locked by a token developer in a rug pull.
          </Para>
          <SubHeading>E-commerce conversion optimization</SubHeading>
          <div className="mt-5 max-w-xl">
            <Stat
              as="p"
              before="Implemented cart upgrade offers that added"
              figure={<CountUp value={52.63} decimals={2} prefix="$" />}
              after="per checkout by optimizing product bundles and user experience."
            />
          </div>
        </Station>

        <Station accent="grey" title="Current projects" early>
          <Para early>I&apos;m actively working with:</Para>
          <ul className={LIST}>
            <Point early>
              Two real estate investors training people on buying distressed properties
            </Point>
            <Point early>A CPG beverage company in their startup phase</Point>
            <Point early>
              Various clients on social commerce optimization for TikTok, Amazon, and YouTube
              platforms
            </Point>
          </ul>
        </Station>
      </div>

      <p className="mt-16 border-t border-zinc-800 pt-10 italic leading-relaxed text-zinc-300">
        Interested in working together?{' '}
        <Link
          href="/contact"
          className="text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
        >
          Contact me
        </Link>{' '}
        to discuss your project and how I can help grow your business.
      </p>
    </div>
  );
}
