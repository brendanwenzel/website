'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { CURVES, NODES, sourceIndex, TIER_SETTINGS } from '@/lib/nodes-config';
import type { StampedEvent } from '@/lib/telemetry-types';

import { getGlowTexture } from './glow-texture';
import { GLOW_BASE_OPACITY, GLOW_BASE_SCALE } from './Nodes';

interface PulsesProps {
  tier: 'full' | 'lite';
  /** Latest telemetry event; `.seq` is the spawn trigger. */
  latest: StampedEvent | null;
  /** Node glow sprites from Nodes — flashed when their source fires. */
  glowRefs: MutableRefObject<(THREE.Sprite | null)[]>;
}

interface PulseSlot {
  active: boolean;
  curve: number;
  t: number;
}

const TRAVEL_SECONDS = 1.4;
const easeInOut = (t: number) => t * t * (3 - 2 * t);

/**
 * Event-driven comets — the "this is live" moment. A fixed pool of sprites
 * (no allocation per event); a new event claims a free slot (or steals the
 * oldest) and travels its source's curve node -> hub while the source node's
 * glow flashes and decays.
 */
export function Pulses({ tier, latest, glowRefs }: PulsesProps) {
  const poolSize = TIER_SETTINGS[tier].pulsePool;
  const spriteRefs = useRef<(THREE.Sprite | null)[]>([]);
  const slots = useRef<PulseSlot[]>(
    Array.from({ length: poolSize }, () => ({ active: false, curve: 0, t: 0 })),
  );
  const flashes = useRef<number[]>(NODES.map(() => 0));
  // Guards Strict Mode's dev double-effect: one pulse per seq, exactly.
  const lastSeq = useRef(0);
  const v = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!latest || latest.seq === lastSeq.current) return;
    lastSeq.current = latest.seq;

    const nodeIdx = sourceIndex(latest.source);
    if (nodeIdx < 0) return;

    const slot =
      slots.current.find((s) => !s.active) ??
      slots.current.reduce((oldest, s) => (s.t > oldest.t ? s : oldest), slots.current[0]);
    const slotIdx = slots.current.indexOf(slot);
    Object.assign(slot, { active: true, curve: nodeIdx, t: 0 });

    const sprite = spriteRefs.current[slotIdx];
    if (sprite) (sprite.material as THREE.SpriteMaterial).color.set(NODES[nodeIdx].color);

    flashes.current[nodeIdx] = 1;
  }, [latest]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    slots.current.forEach((slot, i) => {
      const sprite = spriteRefs.current[i];
      if (!sprite) return;
      if (!slot.active) {
        sprite.visible = false;
        return;
      }
      slot.t += dt / TRAVEL_SECONDS;
      if (slot.t >= 1) {
        slot.active = false;
        sprite.visible = false;
        return;
      }
      CURVES[slot.curve].getPoint(easeInOut(slot.t), v.current);
      sprite.position.copy(v.current);
      const swell = 0.32 * (1 + 0.5 * Math.sin(Math.PI * slot.t));
      sprite.scale.setScalar(swell);
      sprite.visible = true;
    });

    // Node glow flash decay.
    flashes.current.forEach((f, i) => {
      if (f <= 0.001) return;
      const next = f * Math.exp(-2.5 * dt);
      flashes.current[i] = next;
      const glow = glowRefs.current[i];
      if (glow) {
        (glow.material as THREE.SpriteMaterial).opacity = GLOW_BASE_OPACITY + 0.5 * next;
        glow.scale.setScalar(GLOW_BASE_SCALE * (1 + 0.6 * next));
      }
    });
  });

  return (
    <>
      {Array.from({ length: poolSize }).map((_, i) => (
        <sprite
          key={i}
          ref={(el) => {
            spriteRefs.current[i] = el;
          }}
          visible={false}
        >
          <spriteMaterial
            map={getGlowTexture()}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </>
  );
}
