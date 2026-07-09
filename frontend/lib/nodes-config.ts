/**
 * Single definition of the pipeline-node layout shared by the 3D scene
 * (nodes, particles, pulses) and the SVG StaticDiagram.
 *
 * Accent colors mirror the Tailwind tokens in app/globals.css — CSS can't
 * feed three.js, so the palette intentionally lives in exactly these two
 * flagged places.
 */

import * as THREE from 'three';

import { SOURCES, type Source } from './telemetry-types';

export interface NodeConfig {
  source: Source;
  label: string;
  position: [number, number, number];
  color: string;
}

export const NODES: NodeConfig[] = [
  { source: 'CAPI Bridge', label: 'capi-bridge', position: [-2.3, 1.0, 0], color: '#34d399' },
  { source: 'Spend → Sheets', label: 'spend-sheets', position: [2.3, 1.0, 0], color: '#38bdf8' },
  { source: 'Sample Automation', label: 'sample-automation', position: [0, -1.7, 0], color: '#fbbf24' },
];

export const HUB_POSITION: [number, number, number] = [0, 0, 0];
export const HUB_COLOR = '#a1a1aa';

export const sourceIndex = (source: Source): number => SOURCES.indexOf(source);

/**
 * One curve per node, node → hub, with the control point pushed back in z
 * for depth. Built once at module load; shared by ambient particles and
 * event pulses.
 */
export const CURVES: THREE.QuadraticBezierCurve3[] = NODES.map((node) => {
  const start = new THREE.Vector3(...node.position);
  const end = new THREE.Vector3(...HUB_POSITION);
  const control = start.clone().lerp(end, 0.5);
  control.z = -0.9;
  return new THREE.QuadraticBezierCurve3(start, control, end);
});

export const TIER_SETTINGS = {
  full: { ambientCount: 150, pulsePool: 8, maxDpr: 1.75, nodeDetail: 2, parallax: true },
  lite: { ambientCount: 45, pulsePool: 4, maxDpr: 1.25, nodeDetail: 1, parallax: false },
} as const;
