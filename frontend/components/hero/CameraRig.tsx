'use client';

import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { journeyState } from '@/hooks/useJourney';
import { NODES } from '@/lib/nodes-config';

const LEGACY_DISTANCE = 6;
const FEATURE_DISTANCE = 6.2;
const CAMERA_DAMPING = 3.2;
const EMPHASIS_DAMPING = 4;

// Hero copy column, mirrored from HeroSection: a max-w-6xl (1152px) centred
// container with 24px padding, and about 620px of headline and body text.
const CONTAINER_WIDTH = 1152;
const CONTAINER_PADDING = 24;
const COPY_WIDTH = 620;
// World width the graph needs: the nodes span 4.6 units, plus room for the
// node radius and half a label on each side.
const GRAPH_WIDTH = 5.5;
// The graph's bounding box runs from y = 1.0 to y = -1.7, so its middle sits
// 0.35 units below the hub.
const GRAPH_MID_BELOW_HUB = 0.35;
// Featured node: radius 0.34, scaled up by Nodes while featured, plus slack.
export const FEATURED_SCALE = 1.14;
const FEATURED_RADIUS = 0.34 * FEATURED_SCALE * 1.04;
const FEATURED_GAP_PX = 18;

interface CameraRigProps {
  /** World x offset of the node group (the hero pushes it right on desktop). */
  groupX: number;
  /** Full tier only: frame the resting graph clear of the hero copy. */
  fitHero: boolean;
  /** 0..1 per node, written here, read by Nodes, Pulses and AmbientParticles. */
  emphasis: MutableRefObject<number[]>;
}

/**
 * Camera framing for the hero and the scroll journey. The camera never
 * rotates: it pans and dollies. With no rotation the projection is exact:
 * a world point at distance d appears at NDC (x, y) when the camera sits at
 * point - (x * halfWidth(d), y * halfHeight(d)).
 *
 * Resting pose (fitHero): the whole graph is scaled and shifted to sit in
 * the space to the right of the hero copy column, so no node or label lands
 * behind the headline. If that space is too narrow to hold a readable graph
 * (small desktop windows) it falls back to the original centred pose, which
 * is also what the lite tier always uses.
 *
 * Journey pose: the featured node sits directly above its Expertise card,
 * with a gap, so it never covers the card. Scroll picks the target (blended
 * from the resting pose, so there is no jump); exponential damping makes the
 * move.
 */
export function CameraRig({ groupX, fitHero, emphasis }: CameraRigProps) {
  const target = useRef(new THREE.Vector3());
  const feature = useRef(new THREE.Vector3());
  const placed = useRef(false);

  useFrame(({ camera, size }, delta) => {
    const dt = Math.min(delta, 0.05);
    const journey = journeyState;
    const { width, height } = size;
    const tan = Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2));
    const aspect = width / height;
    // Camera position that puts world point (x, y, 0) at canvas px (px, py)
    // from distance d.
    const frame = (out: THREE.Vector3, x: number, y: number, px: number, py: number, d: number) =>
      out.set(
        x - ((px / width) * 2 - 1) * d * tan * aspect,
        y - (1 - (py / height) * 2) * d * tan,
        d,
      );

    // Resting pose.
    const legacyScale = height / 2 / (LEGACY_DISTANCE * tan); // px per world unit
    const left = Math.max(0, (width - CONTAINER_WIDTH) / 2) + CONTAINER_PADDING + COPY_WIDTH;
    const right = width - CONTAINER_PADDING;
    const fitScale = (right - left) / GRAPH_WIDTH;
    if (fitHero && fitScale >= 0.5 * legacyScale) {
      const scale = Math.min(fitScale, legacyScale);
      frame(
        target.current,
        groupX,
        0,
        (left + right) / 2,
        0.47 * height - GRAPH_MID_BELOW_HUB * scale,
        height / 2 / (scale * tan),
      );
    } else {
      // The mobile visual is a separate, shorter box below the copy.
      // Centre it for both touch devices and narrow desktop windows.
      target.current.set(width < 768 ? groupX : 0, 0, LEGACY_DISTANCE);
    }

    if (journey.enabled && journey.blend > 0) {
      const node = NODES[journey.node] ?? NODES[0];
      const scale = height / 2 / (FEATURE_DISTANCE * tan);
      frame(
        feature.current,
        groupX + node.position[0],
        node.position[1],
        journey.anchorX,
        journey.rowTop - FEATURED_GAP_PX - FEATURED_RADIUS * scale,
        FEATURE_DISTANCE,
      );
      target.current.lerp(feature.current, journey.blend);
    }

    // First frame snaps, so the scene fades in already framed.
    if (placed.current) {
      camera.position.lerp(target.current, 1 - Math.exp(-CAMERA_DAMPING * dt));
    } else {
      camera.position.copy(target.current);
      placed.current = true;
    }

    const featured = journey.enabled ? journey.active : -1;
    const k = 1 - Math.exp(-EMPHASIS_DAMPING * dt);
    const values = emphasis.current;
    for (let i = 0; i < values.length; i++) {
      values[i] += ((i === featured ? 1 : 0) - values[i]) * k;
    }
  });

  return null;
}
