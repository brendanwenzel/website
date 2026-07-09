'use client';

/**
 * True while the hero should render frames: the tab is visible AND the
 * container is (even 5%) on screen. Drives frameloop 'always' | 'never'.
 */

import { useEffect, useState, type RefObject } from 'react';

export function useHeroActive(ref: RefObject<HTMLElement | null>): boolean {
  const [active, setActive] = useState(true);

  useEffect(() => {
    let tabVisible = !document.hidden;
    let onScreen = true;
    const update = () => setActive(tabVisible && onScreen);

    const onVisibility = () => {
      tabVisible = !document.hidden;
      update();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        update();
      },
      { threshold: 0.05 },
    );
    if (ref.current) io.observe(ref.current);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
    };
  }, [ref]);

  return active;
}
