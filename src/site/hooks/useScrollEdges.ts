import { useEffect, useState, type RefObject } from 'react';

type ScrollEdges = {
  start: boolean;
  end: boolean;
};

/**
 * Whether a scroller has hidden content at its start or end. A 1px slop
 * ignores subpixel rounding so a resting edge does not show a fade.
 */
export function useScrollEdges(
  ref: RefObject<HTMLElement | null>,
): ScrollEdges {
  const [edges, setEdges] = useState<ScrollEdges>({
    start: false,
    end: false,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    let active = true;
    const update = () => {
      if (!active) {
        return;
      }
      const max = el.scrollWidth - el.clientWidth;
      setEdges({
        start: el.scrollLeft > 1,
        end: max > 1 && el.scrollLeft < max - 1,
      });
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(el);
    void document.fonts?.ready.then(update);

    return () => {
      active = false;
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      observer?.disconnect();
    };
  }, [ref]);

  return edges;
}
