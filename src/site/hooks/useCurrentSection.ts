import { useEffect, useState } from 'react';

import type { SectionId } from '../types';

/**
 * The section nearest the top of the viewport, for `aria-current` in the nav.
 * `select` lets a nav click set it right away, before scrolling catches up.
 */
export function useCurrentSection(ids: readonly SectionId[]) {
  const [current, setCurrent] = useState<SectionId>(ids[0]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) {
          setCurrent(hit.target.id as SectionId);
        }
      },
      { rootMargin: '0px 0px -60% 0px' },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [ids]);

  return { current, select: setCurrent };
}
