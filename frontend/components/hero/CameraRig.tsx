'use client';

import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { journeyState } from '@/hooks/useJourney';
import { NODES } from '@/lib/nodes-config';

const HOME = new THREE.Vector3(0, 0, 6);
const FEATURE_DISTANCE = 5.3;
const CAMERA_DAMPING = 3.2;
const EMPHASIS_DAMPING = 4;

interface CameraRigProps {
  /** World x offset of the node group (the hero pushes it right on desktop). */
  groupX: number;
  /** 0..1 per node, written here, read by Nodes, Pulses and AmbientParticles. */
  emphasis: MutableRefObject<number[]>;
}

/**
 * Scroll camera journey. The camera never rotates: it pans and dollies so the
 * featured node lands on the screen point the scroll driver asked for (just
 * above its Expertise card). With no rotation the projection is exact:
 * a point at distance d appears at NDC (x, y) when the camera sits at
 * node - (x * halfWidth(d), y * halfHeight(d)).
 *
 * Scroll picks the target; exponential damping makes the move. With the
 * journey disabled the target is the hero pose, which is also the camera's
 * initial position, so lite tier behaviour is unchanged.
 */
export function CameraRig({ groupX, emphasis }: CameraRigProps) {
  const target = useRef(new THREE.Vector3());
  const feature = useRef(new THREE.Vector3());

  useFrame(({ camera, size }, delta) => {
    const dt = Math.min(delta, 0.05);
    const journey = journeyState;
    const on = journey.enabled && journey.blend > 0;

    target.current.copy(HOME);
    if (on) {
      const node = NODES[journey.node] ?? NODES[0];
      const fov = (camera as THREE.PerspectiveCamera).fov;
      const halfH = FEATURE_DISTANCE * Math.tan(THREE.MathUtils.degToRad(fov / 2));
      const halfW = halfH * (size.width / size.height);
      const ndcX = (journey.anchorX / size.width) * 2 - 1;
      const ndcY = 1 - (journey.anchorY / size.height) * 2;
      feature.current.set(
        groupX + node.position[0] - ndcX * halfW,
        node.position[1] - ndcY * halfH,
        FEATURE_DISTANCE,
      );
      target.current.lerp(feature.current, journey.blend);
    }
    camera.position.lerp(target.current, 1 - Math.exp(-CAMERA_DAMPING * dt));

    const featured = journey.enabled ? journey.active : -1;
    const k = 1 - Math.exp(-EMPHASIS_DAMPING * dt);
    const values = emphasis.current;
    for (let i = 0; i < values.length; i++) {
      values[i] += ((i === featured ? 1 : 0) - values[i]) * k;
    }
  });

  return null;
}
