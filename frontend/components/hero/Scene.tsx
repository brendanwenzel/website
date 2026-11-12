'use client';

import { Component, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useHeroActive } from '@/hooks/useHeroActive';
import { NODES, TIER_SETTINGS } from '@/lib/nodes-config';
import type { StampedEvent } from '@/lib/telemetry-types';

import { AmbientParticles } from './AmbientParticles';
import { CameraRig } from './CameraRig';
import { Nodes } from './Nodes';
import { Pulses } from './Pulses';
import { StaticDiagram } from './StaticDiagram';

interface SceneProps {
  tier: 'full' | 'lite';
  latest: StampedEvent | null;
  containerRef: RefObject<HTMLDivElement | null>;
  /** True once the camera journey has faded the canvas out. */
  suspended: boolean;
  onWebGLFailed: () => void;
}

export function Scene({ tier, latest, containerRef, suspended, onWebGLFailed }: SceneProps) {
  // Hard pause when the tab is hidden, the canvas is off-screen, or the
  // journey has faded it out. 'demand' would be wrong here: the ambient flow
  // animates continuously, so it would mean invalidate() every frame.
  const active = useHeroActive(containerRef, suspended);
  const [ready, setReady] = useState(false);

  return (
    // If WebGL context creation throws, fall back to the SVG diagram (the
    // hero never looks broken) and tell the parent so the journey turns off.
    <WebGLErrorBoundary fallback={<StaticDiagram latest={latest} />} onError={onWebGLFailed}>
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
  // Per-node 0..1 "featured" amount, written by CameraRig.
  const emphasis = useRef<number[]>(NODES.map(() => 0));
  const pointer = useRef({ x: 0, y: 0 });
  const settings = TIER_SETTINGS[tier];
  // Offset right on the full tier (the original centred pose leans on it;
  // CameraRig's fitted hero pose accounts for it); centered on the lite
  // (touch) tier where the text stacks above the diagram anyway.
  const groupX = tier === 'full' ? 0.9 : 0;

  // The canvas layer is pointer-events-none (it sits behind page content),
  // so r3f's own pointer never updates. Track the window pointer instead.
  useEffect(() => {
    if (!settings.parallax) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = 1 - (event.clientY / window.innerHeight) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [settings.parallax]);

  // Slow group sway + subtle pointer parallax (full tier only).
  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group || !settings.parallax) return;
    const sway = 0.05 * Math.sin(clock.elapsedTime * 0.15);
    group.rotation.y += (sway + pointer.current.x * 0.035 - group.rotation.y) * 0.05;
    group.rotation.x += (-pointer.current.y * 0.025 - group.rotation.x) * 0.05;
  });

  return (
    <>
      <CameraRig groupX={groupX} fitHero={tier === 'full'} emphasis={emphasis} />
      <group ref={groupRef} position={[groupX, 0, 0]}>
        <Nodes tier={tier} glowRefs={glowRefs} emphasis={emphasis} />
        <AmbientParticles count={settings.ambientCount} emphasis={emphasis} />
        <Pulses tier={tier} latest={latest} glowRefs={glowRefs} emphasis={emphasis} />
      </group>
    </>
  );
}

class WebGLErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
