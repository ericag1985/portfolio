import { useEffect, useRef, useState, type FocusEvent } from 'react';

import {
  clearTimer,
  delayToken,
  isOpenRequested,
  readDuration,
  type TooltipActivity,
} from './utils';

/**
 * Hover, focus, and Escape for one tooltip.
 *
 * The bubble stays while the pointer is over the control or the trigger has
 * focus. Escape is listened for on `document` in the capture phase while the
 * tooltip is opening or open, so a hover-opened bubble can be dismissed when
 * focus is elsewhere. Escape does not move focus, and the bubble stays
 * dismissed until the pointer and keyboard focus have both left
 * (WCAG 2.2 1.4.13).
 */
export function useTooltip() {
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const openRef = useRef(false);
  const activity = useRef<TooltipActivity>({
    pointer: false,
    focus: false,
    suppressed: false,
  });
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const openingTimer = openTimer;
    const closingTimer = closeTimer;
    return () => {
      clearTimer(openingTimer);
      clearTimer(closingTimer);
    };
  }, []);

  useEffect(() => {
    if (!open && !opening) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }
      if (!openRef.current && openTimer.current === null) {
        return;
      }
      event.stopPropagation();
      activity.current.suppressed = true;
      clearTimer(openTimer);
      clearTimer(closeTimer);
      setOpening(false);
      openRef.current = false;
      setOpen(false);
    }

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open, opening]);

  function setShown(next: boolean) {
    openRef.current = next;
    setOpen(next);
  }

  function requestOpen() {
    clearTimer(closeTimer);
    if (openRef.current || openTimer.current !== null) {
      return;
    }
    setOpening(true);
    openTimer.current = window.setTimeout(() => {
      openTimer.current = null;
      setOpening(false);
      if (!isOpenRequested(activity.current)) {
        return;
      }
      setShown(true);
    }, readDuration(delayToken.open));
  }

  function requestClose() {
    clearTimer(openTimer);
    setOpening(false);
    if (!openRef.current || closeTimer.current !== null) {
      return;
    }
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      if (isOpenRequested(activity.current)) {
        return;
      }
      setShown(false);
    }, readDuration(delayToken.close));
  }

  function sync() {
    if (isOpenRequested(activity.current)) {
      requestOpen();
      return;
    }
    requestClose();
  }

  function releaseIfIdle() {
    const current = activity.current;
    if (!current.pointer && !current.focus) {
      current.suppressed = false;
    }
  }

  function onPointerEnter() {
    activity.current.pointer = true;
    sync();
  }

  function onPointerLeave() {
    activity.current.pointer = false;
    releaseIfIdle();
    sync();
  }

  function onFocus() {
    activity.current.focus = true;
    sync();
  }

  function onBlur(event: FocusEvent<HTMLElement>) {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) {
      return;
    }
    activity.current.focus = false;
    releaseIfIdle();
    sync();
  }

  return { open, onPointerEnter, onPointerLeave, onFocus, onBlur };
}
