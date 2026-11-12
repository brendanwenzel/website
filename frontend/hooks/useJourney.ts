'use client';

/**
 * Camera journey state for the home page (full tier, desktop widths only).
 *
 * One mutable record shared by three readers:
 *   - the scroll driver below writes it (rAF-throttled, passive listeners),
 *   - CameraRig reads it every frame inside the r3f loop (no React renders),
 *   - the Expertise cards subscribe to `active` only, so they re-render three
 *     times per pass through the section instead of once per scroll event.
 *
 * This file must stay free of three.js imports: the cards pull it into the
 * page bundle, and the 3D code has to stay in its own lazy chunk.
 */

import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';

import { JOURNEY_MIN_WIDTH_QUERY } from '@/lib/perf-tier';

export interface JourneyState {
  /** False on lite/static tiers, narrow viewports, pause, or WebGL failure. */
  enabled: boolean;
  /** Node index whose card is highlighted, or -1. */
  active: number;
  /** Node index the camera frames once `blend` is above zero. */
  node: number;
  /** 0 = hero camera, 1 = fully on the featured node. Scroll driven. */
  blend: number;
  /**
   * Screen anchor for the featured node, in px from the canvas top-left:
   * its centre x, and the top edge of the card row. CameraRig parks the node
   * just above that edge, so it never covers the card's label or title.
   */
  anchorX: number;
  rowTop: number;
}

export const journeyState: JourneyState = {
  enabled: false,
  active: -1,
  node: 0,
  blend: 0,
  anchorX: 0,
  rowTop: 0,
};

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const setActive = (index: number) => {
  if (journeyState.active === index) return;
  journeyState.active = index;
  listeners.forEach((listener) => listener());
};

/** Node index of the active Expertise card, -1 when none (and on the server). */
export function useJourneyActive(): number {
  return useSyncExternalStore(
    subscribe,
    () => journeyState.active,
    () => -1,
  );
}

const subscribeWidth = (listener: () => void) => {
  const query = window.matchMedia(JOURNEY_MIN_WIDTH_QUERY);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
};

/** True at widths where the cards sit in a row and the journey makes sense. */
export function useJourneyWidth(): boolean {
  return useSyncExternalStore(
    subscribeWidth,
    () => window.matchMedia(JOURNEY_MIN_WIDTH_QUERY).matches,
    () => false,
  );
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (n: number) => n * n * (3 - 2 * n);

// All thresholds are fractions of the viewport height.
const BLEND_START = 1.15; // card row top here: camera starts leaving the hero pose
const JOURNEY_START = 0.86; // card row top here: first card becomes active
const JOURNEY_END = 0.24; // card row top here: last card has had its turn (the
// node above the row still fits on screen; after this it scrolls off the top
// with the row, and the fade below takes over)
const FADE_START = 0.45; // section bottom here: canvas starts fading
const FADE_END = 0.2; // section bottom here: canvas is gone, rendering stops
const ANCHOR_INSET_X = 44; // px in from the card's right edge, which keeps
// the first card's node and its glow clear of the section heading

/**
 * Maps scroll position to journey state while `enabled`. Returns true once
 * the canvas has fully faded out, so the caller can stop the render loop.
 */
export function useJourneyDriver(
  enabled: boolean,
  layerRef: RefObject<HTMLElement | null>,
): boolean {
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    const layer = layerRef.current;
    if (!enabled || !layer) return;
    const section = document.querySelector<HTMLElement>('[data-journey-section]');
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-journey-card]'));
    if (!section || cards.length === 0) return;
    const nodeOf = (card: HTMLElement) => Number(card.dataset.journeyNode ?? 0);

    let frame = 0;
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      const layerRect = layer.getBoundingClientRect();
      const rowTop = cards[0].getBoundingClientRect().top;

      const progress = (JOURNEY_START * vh - rowTop) / ((JOURNEY_START - JOURNEY_END) * vh);
      const step =
        progress < 0 ? -1 : Math.min(cards.length - 1, Math.floor(progress * cards.length));
      const fade = clamp01(
        (section.getBoundingClientRect().bottom - FADE_END * vh) / ((FADE_START - FADE_END) * vh),
      );

      const card = cards[Math.max(step, 0)];
      const rect = card.getBoundingClientRect();
      journeyState.node = nodeOf(card);
      journeyState.blend = smooth(
        clamp01((BLEND_START * vh - rowTop) / ((BLEND_START - JOURNEY_START) * vh)),
      );
      journeyState.anchorX = rect.right - ANCHOR_INSET_X - layerRect.left;
      journeyState.rowTop = rect.top - layerRect.top;

      setActive(step < 0 || fade <= 0 ? -1 : nodeOf(card));
      layer.style.opacity = String(fade);
      setFaded(fade <= 0);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    journeyState.enabled = true;
    measure();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });

    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      if (frame) cancelAnimationFrame(frame);
      journeyState.enabled = false;
      journeyState.blend = 0;
      setActive(-1);
      layer.style.opacity = '';
      setFaded(false);
    };
  }, [enabled, layerRef]);

  return faded;
}
