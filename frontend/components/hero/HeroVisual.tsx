'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { detectTier, type Tier } from '@/lib/perf-tier';

// Next 15: dynamic(..., { ssr: false }) is only legal inside a client
// component — this shim exists so HeroSection can stay a server component.
// three.js + r3f land in their own chunk, fetched after hydration; the
// gradient backdrop in HeroSection is the placeholder, so loading renders
// nothing.
const TelemetryHero = dynamic(() => import('./TelemetryHero'), {
  ssr: false,
  loading: () => null,
});

export default function HeroVisual() {
  // A 'use client' component still prerenders on the server (ssr:false only
  // covers the dynamic child), so browser APIs are off-limits until mount.
  // Tier is detected once, after mount, and never re-evaluated.
  const [tier, setTier] = useState<Tier | null>(null);
  useEffect(() => setTier(detectTier()), []);

  if (!tier) return null;
  return <TelemetryHero tier={tier} />;
}
