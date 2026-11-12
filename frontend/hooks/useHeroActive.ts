'use client';

/**
 * True while the scene should render frames: the tab is visible AND the
 * container is (even 5%) on screen AND the caller has not suspended it.
 * Drives frameloop 'always' | 'never'.
 *
 * `suspended` is how the camera journey stops the loop: on the full tier the
 * canvas is sticky behind the Expertise section, so it never leaves the
 * viewport on its own. Once the journey has faded it to zero opacity the
 * driver reports that here.
 */

import { useEffect, useState, type RefObject } from 'react';

export function useHeroActive(ref: RefObject<HTMLElement | null>, suspended = false): boolean {
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

  return active && !suspended;
}
