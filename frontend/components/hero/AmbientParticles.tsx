'use client';

import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { CURVES, NODES } from '@/lib/nodes-config';

import { getGlowTexture } from './glow-texture';

/**
 * The idle flow: ONE THREE.Points (one draw call). Each particle drifts along
 * one of the node->hub curves with its own phase and speed; positions are
 * rewritten into the buffer attribute every frame — trivial CPU work at these
 * counts (<= 150 curve lookups).
 */
interface AmbientParticlesProps {
  count: number;
  /** 0..1 per node: flow on the featured node's curve runs a little faster. */
  emphasis: MutableRefObject<number[]>;
}

export function AmbientParticles({ count, emphasis }: AmbientParticlesProps) {
  const positionAttr = useRef<THREE.BufferAttribute>(null);
  // Own accumulated time (not the global clock) so pause/resume via
  // frameloop='never' can't cause a jump; dt is clamped for the same reason.
  // One clock per curve, so speeding one curve up never makes particles jump.
  const time = useRef<number[]>(CURVES.map(() => 0));

  const { particles, positions, colors } = useMemo(() => {
    const particles = Array.from({ length: count }, () => ({
      curve: Math.floor(Math.random() * CURVES.length),
      phase: Math.random(),
      speed: 0.05 + Math.random() * 0.08,
    }));
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color();
    particles.forEach((p, i) => {
      c.set(NODES[p.curve].color);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    });
    return { particles, positions, colors };
  }, [count]);

  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    for (let c = 0; c < time.current.length; c++) {
      time.current[c] += dt * (1 + 0.6 * (emphasis.current[c] ?? 0));
    }
    const attr = positionAttr.current;
    if (!attr) return;
    const array = attr.array as Float32Array;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      CURVES[p.curve].getPoint((p.phase + time.current[p.curve] * p.speed) % 1, v);
      array[i * 3] = v.x;
      array[i * 3 + 1] = v.y;
      array[i * 3 + 2] = v.z;
    }
    attr.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute ref={positionAttr} attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        map={getGlowTexture()}
        vertexColors
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
