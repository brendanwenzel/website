import * as THREE from 'three';

/**
 * One shared radial-gradient sprite texture for node glows, particles, and
 * pulses (browser-only module — only imported beneath the ssr:false split).
 */
let texture: THREE.CanvasTexture | null = null;

export function getGlowTexture(): THREE.CanvasTexture {
  if (texture) return texture;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.45)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  texture = new THREE.CanvasTexture(canvas);
  return texture;
}
