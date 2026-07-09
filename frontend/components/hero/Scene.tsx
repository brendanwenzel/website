'use client';

import { Component, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useHeroActive } from '@/hooks/useHeroActive';
import { TIER_SETTINGS } from '@/lib/nodes-config';
import type { StampedEvent } from '@/lib/telemetry-types';

import { AmbientParticles } from './AmbientParticles';
import { Nodes } from './Nodes';
import { Pulses } from './Pulses';
import { StaticDiagram } from './StaticDiagram';

interface SceneProps {
  tier: 'full' | 'lite';
  latest: StampedEvent | null;
  containerRef: RefObject<HTMLDivElement | null>;
}

export function Scene({ tier, latest, containerRef }: SceneProps) {
  // Hard pause when the tab is hidden or the hero is scrolled off-screen.
  // 'demand' would be wrong here: the ambient flow animates continuously, so
  // it would mean invalidate() every frame — 'always' with extra steps.
  const active = useHeroActive(containerRef);
  const [ready, setReady] = useState(false);

  return (
    // If WebGL context creation throws, fall back to the SVG diagram — the
    // hero never looks broken.
    <WebGLErrorBoundary fallback={<StaticDiagram latest={latest} />}>
      <div
        className={`h-full w-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
      >
        <Canvas
          frameloop={active ? 'always' : 'never'}
          dpr={[1, TIER_SETTINGS[tier].maxDpr]}
          gl={{ antialias: false, powerPreference: 'low-power', alpha: true }}
          camera={{ position: [0, 0, 6], fov: 45 }}
          onCreated={() => setReady(true)}
        >
          <SceneContent tier={tier} latest={latest} />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}

function SceneContent({ tier, latest }: { tier: 'full' | 'lite'; latest: StampedEvent | null }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRefs = useRef<(THREE.Sprite | null)[]>([]);
  const settings = TIER_SETTINGS[tier];

  // Slow group sway + subtle pointer parallax (full tier only).
  useFrame(({ clock, pointer }) => {
    const group = groupRef.current;
    if (!group || !settings.parallax) return;
    const sway = 0.05 * Math.sin(clock.elapsedTime * 0.15);
    group.rotation.y += (sway + pointer.x * 0.035 - group.rotation.y) * 0.05;
    group.rotation.x += (-pointer.y * 0.025 - group.rotation.x) * 0.05;
  });

  return (
    // Offset right on desktop so the headline column stays clean; centered on
    // the lite (touch) tier where the text stacks above the diagram anyway.
    <group ref={groupRef} position={[tier === 'full' ? 0.9 : 0, 0, 0]}>
      <Nodes tier={tier} glowRefs={glowRefs} />
      <AmbientParticles count={settings.ambientCount} />
      <Pulses tier={tier} latest={latest} glowRefs={glowRefs} />
    </group>
  );
}

class WebGLErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
