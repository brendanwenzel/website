'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
};

/**
 * Counts from zero to `value` once, the first time it scrolls into view.
 * The server render (and the JS-off page) already shows the final text, and
 * reduced-motion visitors never see anything else.
 */
export function CountUp({ value, decimals = 0, prefix = '', suffix = '', durationMs = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / durationMs);
          setShown(p === 1 ? value : value * (1 - Math.pow(1 - p, 3)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}
