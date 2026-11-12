import styles from './timeline.module.css';

type Props = {
  /** What the line measures, in the page's own words. */
  measure: string;
  startLabel: string;
  endLabel: string;
  /** Start value as a fraction of the end value; the baseline is zero. */
  startRatio: number;
  /** The span the rise happened over, in the page's own words. */
  span: string;
  tag?: string;
  /** Spoken description stating both values. */
  description: string;
  /** The original sentence from the page. */
  caption: string;
};

/**
 * A two-point chart. Only the endpoints are known, so the line between them
 * is straight and nothing else is plotted: no ticks, no intermediate values.
 * The SVG stretches to the plot box; labels and dots are HTML so they keep
 * their size on a phone.
 */
export function RiseChart({
  measure,
  startLabel,
  endLabel,
  startRatio,
  span,
  tag,
  description,
  caption,
}: Props) {
  const y0 = (100 - startRatio * 100).toFixed(2);
  return (
    <figure
      className={`${styles.figure} rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">{measure}</p>
        {tag ? (
          <p className={`${styles.tag} shrink-0 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-xs`}>{tag}</p>
        ) : null}
      </div>

      <div
        className={styles.plot}
        style={{ '--start': `${(startRatio * 100).toFixed(2)}%` } as React.CSSProperties}
      >
        <svg
          className={styles.line}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="img"
          aria-label={description}
        >
          <title>{description}</title>
          <polygon className={styles.area} points={`0,${y0} 100,0 100,100 0,100`} />
          <path
            className={styles.stroke}
            d={`M0,${y0} L100,0`}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className={`${styles.dot} ${styles.dotStart}`} aria-hidden="true" />
        <span className={`${styles.dot} ${styles.dotEnd}`} aria-hidden="true" />
        <span className={`${styles.label} ${styles.labelStart} font-mono text-sm text-zinc-300`}>
          {startLabel}
        </span>
        <span
          className={`${styles.label} ${styles.labelEnd} font-mono text-lg font-medium sm:text-xl`}
        >
          {endLabel}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3 font-mono text-xs text-zinc-400">
        <span className={styles.bracket} aria-hidden="true" />
        <span>{span}</span>
        <span className={`${styles.bracket} ${styles.bracketEnd}`} aria-hidden="true" />
      </div>

      <figcaption className="mt-5 text-sm leading-relaxed text-zinc-300">{caption}</figcaption>
    </figure>
  );
}
