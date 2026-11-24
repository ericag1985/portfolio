import { useEffect, useRef, useState, type FocusEvent } from 'react';

import { viewportMargin, viewportNudge } from './utils';

/**
 * Hover, focus within, and Escape for one tooltip. CSS owns showing,
 * hiding, and the delays (see `data-state` in `Tooltip.module.css`).
 *
 * Hover is tracked here rather than with CSS `:hover` because test tools fire
 * synthetic pointer events that never set `:hover`. Escape hides the bubble
 * without moving focus or stopping propagation, and it stays hidden until
 * the root is neither hovered nor focused (WCAG 2.2 1.4.13).
 */
export function useTooltip() {
  const rootRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const active = hovered || focused;
  const state = !active ? 'closed' : dismissed ? 'dismissed' : 'open';

  // Once neither hovered nor focused, the next hover or focus opens it again.
  if (!active && dismissed) {
    setDismissed(false);
  }

  useEffect(() => {
    if (!active || dismissed) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDismissed(true);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active, dismissed]);

  /**
   * Keeps the bubble inside the viewport (WCAG 1.4.10). A hidden bubble is
   * still laid out, so this runs before it shows. The nudge is reset first
   * so the measurement is the un-nudged position.
   */
  function fitToViewport() {
    const root = rootRef.current;
    const bubble = bubbleRef.current;
    if (!root || !bubble) {
      return;
    }
    root.style.setProperty('--tooltip-nudge', '0px');
    const nudge = viewportNudge(
      bubble.getBoundingClientRect(),
      document.documentElement.clientWidth,
      viewportMargin,
    );
    root.style.setProperty('--tooltip-nudge', `${nudge}px`);
  }

  return {
    rootRef,
    bubbleRef,
    state,
    onPointerEnter() {
      fitToViewport();
      setHovered(true);
    },
    onPointerLeave() {
      setHovered(false);
    },
    onFocus() {
      fitToViewport();
      setFocused(true);
    },
    onBlur(event: FocusEvent<HTMLElement>) {
      if (event.currentTarget.contains(event.relatedTarget)) {
        return;
      }
      setFocused(false);
    },
  };
}
