'use client';

import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

import { CURVES, HUB_COLOR, HUB_POSITION, NODES, TIER_SETTINGS } from '@/lib/nodes-config';

import { getGlowTexture } from './glow-texture';

interface NodesProps {
  tier: 'full' | 'lite';
  /** Filled here, flash-animated by Pulses. Index matches NODES/SOURCES. */
  glowRefs: MutableRefObject<(THREE.Sprite | null)[]>;
}

export const GLOW_BASE_OPACITY = 0.35;
export const GLOW_BASE_SCALE = 0.9;

export function Nodes({ tier, glowRefs }: NodesProps) {
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const detail = TIER_SETTINGS[tier].nodeDetail;
  const glow = getGlowTexture();

  // Gentle breathing so the scene is alive even with zero traffic.
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    groupRefs.current.forEach((group, i) => {
      group?.scale.setScalar(1 + 0.03 * Math.sin(t * 0.8 + i * 2.1));
    });
  });

  return (
    <>
      {/* Edges first: node -> hub curves shared with particles/pulses. */}
      {CURVES.map((curve, i) => (
        <Line
          key={NODES[i].source}
          points={curve.getPoints(24)}
          color="#52525b"
          transparent
          opacity={0.18}
          lineWidth={1}
        />
      ))}

      {NODES.map((node, i) => (
        <group
          key={node.source}
          position={node.position}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
        >
          <mesh>
            <icosahedronGeometry args={[0.34, detail]} />
            <meshBasicMaterial color={node.color} wireframe transparent opacity={0.7} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#18181b" />
          </mesh>
          <sprite
            ref={(el) => {
              glowRefs.current[i] = el;
            }}
            scale={[GLOW_BASE_SCALE, GLOW_BASE_SCALE, 1]}
          >
            <spriteMaterial
              map={glow}
              color={node.color}
              transparent
              opacity={GLOW_BASE_OPACITY}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
          <Html position={[0, -0.62, 0]} center wrapperClass="pointer-events-none select-none">
            <span className="whitespace-nowrap font-mono text-[10px] tracking-wider text-zinc-500">
              {node.label}
            </span>
          </Html>
        </group>
      ))}

      {/* Hub — the unlabeled core everything flows into. */}
      <group position={HUB_POSITION}>
        <mesh>
          <icosahedronGeometry args={[0.22, detail]} />
          <meshBasicMaterial color={HUB_COLOR} wireframe transparent opacity={0.5} />
        </mesh>
        <sprite scale={[0.7, 0.7, 1]}>
          <spriteMaterial
            map={glow}
            color={HUB_COLOR}
            transparent
            opacity={0.2}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>
    </>
  );
}
