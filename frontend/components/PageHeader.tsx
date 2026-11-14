import Link from 'next/link';
import { useId } from 'react';

import styles from './PageHeader.module.css';

/**
 * Animated page header for the services and contact pages: inline SVG plus CSS
 * keyframes only (no canvas, no client JS), drawn in the visual language of the
 * home hero (wireframe node, soft glow, mono label, signal pulses).
 *
 * Every animated element rests in a complete state, because the global
 * prefers-reduced-motion rule in app/globals.css removes all animation.
 */

export interface HeaderNode {
  accent: string;
  label: string;
  /** Sub-page the node links to, with the name read out to assistive tech. */
  href: string;
  name: string;
}

interface IllustratedPageHeaderProps {
  variant?: 'illustrated';
  /** Colour of the node (single layout). */
  accent: string;
  /** Mono label under the node (single layout). */
  label: string;
  title: string;
  intro?: string;
  /** Colours of the three incoming signal lines. Defaults to the accent. */
  pulseColors?: [string, string, string];
  /** When set, draws these nodes small in a row, each a link, pulsing in turn. */
  nodes?: HeaderNode[];
}

type PageHeaderProps = IllustratedPageHeaderProps | {
  variant: 'plain';
  title: string;
  intro?: string;
};

/* Icosahedron wireframe, projected once at module load. */

const PHI = (1 + Math.sqrt(5)) / 2;
const VERTS: [number, number, number][] = [];
for (const a of [-1, 1]) {
  for (const b of [-PHI, PHI]) {
    VERTS.push([0, a, b], [a, b, 0], [b, 0, a]);
  }
}
const EDGES: [number, number][] = [];
for (let i = 0; i < VERTS.length; i++) {
  for (let j = i + 1; j < VERTS.length; j++) {
    const d = Math.hypot(
      VERTS[i][0] - VERTS[j][0],
      VERTS[i][1] - VERTS[j][1],
      VERTS[i][2] - VERTS[j][2],
    );
    if (Math.abs(d - 2) < 0.01) EDGES.push([i, j]);
  }
}
const CIRCUMRADIUS = Math.hypot(1, PHI);

function project(rx: number, ry: number) {
  const pts = VERTS.map(([x, y, z]) => {
    const y1 = y * Math.cos(rx) - z * Math.sin(rx);
    const z1 = y * Math.sin(rx) + z * Math.cos(rx);
    const x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
    const z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
    return [x2 / CIRCUMRADIUS, y1 / CIRCUMRADIUS, z2] as const;
  });
  return EDGES.map(([i, j]) => ({
    x1: pts[i][0],
    y1: pts[i][1],
    x2: pts[j][0],
    y2: pts[j][1],
    front: pts[i][2] + pts[j][2] >= 0,
  }));
}
const WIRE_OUTER = project(0.42, 0.31);
const WIRE_INNER = project(1.1, -0.7);

const n = (v: number) => Math.round(v * 100) / 100;

function Wire({ edges, r, color, width }: { edges: typeof WIRE_OUTER; r: number; color: string; width: number }) {
  return (
    <>
      {edges.map((e, i) => (
        <line
          key={i}
          x1={n(e.x1 * r)}
          y1={n(e.y1 * r)}
          x2={n(e.x2 * r)}
          y2={n(e.y2 * r)}
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          opacity={e.front ? 0.95 : 0.35}
        />
      ))}
    </>
  );
}

/** Glow plus two counter-rotating wireframes, centred on (cx, cy). */
function WireNode({ cx, cy, r, color, gid }: { cx: number; cy: number; r: number; color: string; gid: string }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <defs>
        <radialGradient id={gid}>
          <stop offset="0" stopColor={color} stopOpacity="0.5" />
          <stop offset="0.45" stopColor={color} stopOpacity="0.16" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className={styles.glow} r={r * 2.1} fill={`url(#${gid})`} />
      <g className={styles.breathe}>
        <g className={styles.spinReverse}>
          <Wire edges={WIRE_INNER} r={r * 0.56} color={color} width={0.8} />
        </g>
        <g className={styles.spin}>
          <Wire edges={WIRE_OUTER} r={r} color={color} width={1.2} />
        </g>
        <circle r={r * 0.09} fill={color} />
      </g>
    </g>
  );
}

/** A signal: faint line, a dot travelling along it, a flash where it lands. */
function Signal({
  d,
  color,
  cx,
  cy,
  r,
  cycle,
  delay,
}: {
  d: string;
  color: string;
  cx: number;
  cy: number;
  r: number;
  cycle: number;
  delay: number;
}) {
  const timing = { animationDuration: `${cycle}s`, animationDelay: `${delay}s` };
  return (
    <>
      <path d={d} fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.32" />
      <g transform={`translate(${cx} ${cy})`}>
        <circle className={styles.flash} r={r * 1.25} fill={color} style={timing} />
        <circle className={styles.ring} r={r * 1.08} fill="none" stroke={color} strokeWidth="1.5" style={timing} />
      </g>
      <circle className={styles.pulseHalo} r="7" fill={color} style={{ offsetPath: `path('${d}')`, ...timing }} />
      <circle className={styles.pulse} r="2.6" fill={color} style={{ offsetPath: `path('${d}')`, ...timing }} />
    </>
  );
}

/* Deterministic particle field (same markup on every render). */
function particles(seed: number, count: number, w: number, h: number) {
  let s = seed;
  const rnd = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    x: n(rnd() * w),
    y: n(rnd() * h),
    r: n(0.7 + rnd() * 1.1),
    o: n(0.18 + rnd() * 0.37),
    dx: n((rnd() - 0.5) * 36),
    dy: n(-8 - rnd() * 26),
    dur: n(11 + rnd() * 14),
    delay: n(-rnd() * 20),
    tint: rnd() < 0.4,
  }));
}

function Particles({ seed, count, w, h, colors }: { seed: number; count: number; w: number; h: number; colors: string[] }) {
  return (
    <>
      {particles(seed, count, w, h).map((p, i) => (
        <circle
          key={i}
          className={styles.particle}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill={p.tint ? colors[i % colors.length] : '#a1a1aa'}
          opacity={p.o}
          style={
            {
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
}

/* Single node: viewBox 480x300, node on the right so the text sits beside it. */
const W = 480;
const H = 300;
const CX = 330;
const CY = 138;
const R = 54;
const SINGLE_PATHS = [
  `M -12 34 C 96 14, 196 150, ${CX - R - 8} ${CY + 4}`,
  `M 492 6 C 452 44, 418 40, ${CX + 40} ${CY - 46}`,
  `M 186 312 C 212 262, 248 214, ${CX - 36} ${CY + 50}`,
];
const SINGLE_CYCLE = 7.5;

function SingleArt({ accent, label, pulseColors, gid }: { accent: string; label: string; pulseColors: string[]; gid: string }) {
  return (
    <div className={styles.art} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} focusable="false">
        <defs>
          <radialGradient id={`${gid}-bg`}>
            <stop offset="0" stopColor="#122031" stopOpacity="0.95" />
            <stop offset="1" stopColor="#122031" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={CX} cy={CY} rx="150" ry="138" fill={`url(#${gid}-bg)`} />
        <Particles seed={label.length * 97 + 11} count={22} w={W} h={H} colors={pulseColors} />
        {SINGLE_PATHS.map((d, i) => (
          <Signal
            key={i}
            d={d}
            color={pulseColors[i]}
            cx={CX}
            cy={CY}
            r={R}
            cycle={SINGLE_CYCLE}
            delay={-SINGLE_CYCLE + (i * SINGLE_CYCLE) / 3}
          />
        ))}
        <WireNode cx={CX} cy={CY} r={R} color={accent} gid={`${gid}-glow`} />
        <text
          x={CX}
          y={CY + R + 44}
          textAnchor="middle"
          fill="#a1a1aa"
          fontSize="13"
          fontFamily="var(--font-geist-mono), monospace"
          letterSpacing="0.08em"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

/* Row of small nodes: one 160x132 cell each, signal dropping in from above. */
const CELL_W = 160;
const CELL_H = 132;
const SMALL_R = 30;
const CELL_CX = 80;
const CELL_CY = 78;
const CELL_PATHS = [
  `M 14 -8 C 22 30, 34 54, ${CELL_CX - SMALL_R - 5} ${CELL_CY - 8}`,
  `M 80 -8 C 62 10, 98 22, ${CELL_CX} ${CELL_CY - SMALL_R - 6}`,
  `M 146 -8 C 138 30, 126 54, ${CELL_CX + SMALL_R + 5} ${CELL_CY - 8}`,
];
const ROW_CYCLE = 7.5;

function NodeRow({ nodes, gid }: { nodes: HeaderNode[]; gid: string }) {
  return (
    <ul className={styles.row}>
      {nodes.map((node, i) => (
        <li key={node.href}>
          <Link href={node.href} className={styles.cell}>
            <svg viewBox={`0 0 ${CELL_W} ${CELL_H}`} aria-hidden="true" focusable="false">
              <defs>
                <radialGradient id={`${gid}-bg${i}`}>
                  <stop offset="0" stopColor="#122031" stopOpacity="0.9" />
                  <stop offset="1" stopColor="#122031" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx={CELL_CX} cy={CELL_CY} r="78" fill={`url(#${gid}-bg${i})`} />
              <Particles seed={i * 131 + 7} count={7} w={CELL_W} h={CELL_H} colors={[node.accent]} />
              <Signal
                d={CELL_PATHS[i % CELL_PATHS.length]}
                color={node.accent}
                cx={CELL_CX}
                cy={CELL_CY}
                r={SMALL_R}
                cycle={ROW_CYCLE}
                delay={-ROW_CYCLE + (i * ROW_CYCLE) / nodes.length}
              />
              <WireNode cx={CELL_CX} cy={CELL_CY} r={SMALL_R} color={node.accent} gid={`${gid}-glow${i}`} />
            </svg>
            <span className={styles.cellLabel}>
              {node.label}
              <span className="sr-only">: {node.name}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function PageHeader(props: PageHeaderProps) {
  if (props.variant === 'plain') {
    return (
      <header className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-50">{props.title}</h1>
        {props.intro ? <p className="mt-4 max-w-2xl text-lg text-zinc-400">{props.intro}</p> : null}
      </header>
    );
  }
  return <IllustratedPageHeader {...props} />;
}

function IllustratedPageHeader({ accent, label, title, intro, pulseColors, nodes }: IllustratedPageHeaderProps) {
  const gid = `ph${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const row = nodes && nodes.length > 0;
  return (
    <header className={`${styles.header} ${row ? styles.headerRow : ''}`}>
      {row ? (
        <NodeRow nodes={nodes} gid={gid} />
      ) : (
        <SingleArt accent={accent} label={label} pulseColors={pulseColors ?? [accent, accent, accent]} gid={gid} />
      )}
      <div className={styles.text}>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-50">{title}</h1>
        {intro ? <p className="mt-4 text-lg text-zinc-400">{intro}</p> : null}
      </div>
    </header>
  );
}
