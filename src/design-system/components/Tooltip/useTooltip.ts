import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import {
  clearTimer,
  delayToken,
  isOpenRequested,
  readDuration,
  touchTapWindowMs,
  type TooltipActivity,
} from './utils';

/**
 * Hover, focus, and touch for one tooltip.
 *
 * A finger lift fires `pointerleave` and cancels the open timer, and iOS does
 * not focus a button on tap, so touch is not treated as hover. The default
 * trigger records when a touch `pointerdown` happened and toggles `pinned`
 * on the click that follows it (see `isTouchTap`). A pinned tooltip closes
 * on a second tap, a pointerdown outside the root, or Escape.
 *
 * Escape is listened for on `document` while the tooltip is opening or open.
 * `stopPropagation()` runs only when the bubble was actually visible, so
 * Escape during the open delay still reaches the focused control. Escape does
 * not move focus (WCAG 2.2 1.4.13).
 */
export function useTooltip() {
  const rootRef = useRef<HTMLSpanElement>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const openRef = useRef(false);
  /** `performance.now()` of the last touch `pointerdown`, or `null`. */
  const touchDownAt = useRef<number | null>(null);
  const activity = useRef<TooltipActivity>({
    pointer: false,
    focus: false,
    pinned: false,
    suppressed: false,
  });
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [pinned, setPinned] = useState(false);

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
      const wasOpen = openRef.current;
      activity.current.pinned = false;
      activity.current.suppressed = true;
      setPinned(false);
      clearTimer(openTimer);
      clearTimer(closeTimer);
      setOpening(false);
      openRef.current = false;
      setOpen(false);
      if (wasOpen) {
        event.stopPropagation();
      }
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

  const releasePinned = useCallback(() => {
    activity.current.pinned = false;
    setPinned(false);
    clearTimer(openTimer);
    clearTimer(closeTimer);
    setOpening(false);
    if (!activity.current.pointer && !activity.current.focus) {
      activity.current.suppressed = false;
      openRef.current = false;
      setOpen(false);
    }
  }, []);

  /**
   * Whether the current focus or click comes from a recent touch tap.
   * Browsers that focus a button on tap (Android Chrome) fire `focus` between
   * `pointerdown` and `click`, with microtasks running in between, so this
   * can't be reset on focus. It expires instead, and `onTriggerClick`
   * consumes it, so a later keyboard Enter, Space, or Tab is never treated
   * as a tap.
   */
  function isTouchTap(): boolean {
    const downAt = touchDownAt.current;
    return downAt !== null && performance.now() - downAt < touchTapWindowMs;
  }

  function onPointerDown(event: ReactPointerEvent<HTMLElement>) {
    touchDownAt.current =
      event.pointerType === 'touch' ? performance.now() : null;
  }

  function onPointerEnter(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === 'touch') {
      return;
    }
    activity.current.pointer = true;
    sync();
  }

  function onPointerLeave(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === 'touch') {
      return;
    }
    activity.current.pointer = false;
    releaseIfIdle();
    sync();
  }

  function onFocus() {
    if (isTouchTap()) {
      return;
    }
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

  function onTriggerClick() {
    const touch = isTouchTap();
    touchDownAt.current = null;
    if (!touch) {
      return;
    }
    if (activity.current.pinned) {
      releasePinned();
      return;
    }
    activity.current.suppressed = false;
    activity.current.pinned = true;
    setPinned(true);
    clearTimer(openTimer);
    clearTimer(closeTimer);
    setOpening(false);
    setShown(true);
  }

  useEffect(() => {
    if (!pinned) {
      return;
    }

    function onPointerDownOutside(event: PointerEvent) {
      const root = rootRef.current;
      if (
        !root ||
        !(event.target instanceof Node) ||
        root.contains(event.target)
      ) {
        return;
      }
      releasePinned();
    }

    document.addEventListener('pointerdown', onPointerDownOutside, true);
    return () =>
      document.removeEventListener('pointerdown', onPointerDownOutside, true);
  }, [pinned, releasePinned]);

  return {
    open,
    rootRef,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    onFocus,
    onBlur,
    onTriggerClick,
  };
}
