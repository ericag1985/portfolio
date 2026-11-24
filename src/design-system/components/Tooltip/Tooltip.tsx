import {
  Children,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type ReactElement,
} from 'react';

import { Icon } from '../Icon';
import styles from './Tooltip.module.css';
import type { TooltipProps, TriggerProps } from './types';
import {
  applyTriggerProps,
  clearTimer,
  defaultTriggerAria,
  delayToken,
  isOpenRequested,
  readDuration,
  resolveTriggerLabel,
  type TooltipActivity,
} from './utils';

/**
 * Short text shown on hover or focus. The tooltip stays up while the pointer
 * is over it, closes when hover and focus both end, and Escape dismisses it
 * without moving focus (WCAG 2.2 1.4.13). It is not portaled: placement is
 * CSS next to the trigger.
 */
export function Tooltip({
  content,
  label,
  naming = 'description',
  placement = 'top',
  children,
}: TooltipProps) {
  const tooltipId = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const openRef = useRef(false);
  const activity = useRef<TooltipActivity>({
    pointer: false,
    focus: false,
    suppressed: false,
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const opening = openTimer;
    const closing = closeTimer;
    const root = rootRef.current;

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }
      if (!openRef.current && openTimer.current === null) {
        return;
      }
      // Leave focus where it is. A parent dialog should not also handle this Escape.
      event.stopPropagation();
      activity.current.suppressed = true;
      clearTimer(openTimer);
      clearTimer(closeTimer);
      openRef.current = false;
      setOpen(false);
    }

    root?.addEventListener('keydown', onKeyDown);
    return () => {
      root?.removeEventListener('keydown', onKeyDown);
      clearTimer(opening);
      clearTimer(closing);
    };
  }, []);

  function setShown(next: boolean) {
    openRef.current = next;
    setOpen(next);
  }

  function requestOpen() {
    clearTimer(closeTimer);
    if (openRef.current || openTimer.current !== null) {
      return;
    }
    openTimer.current = window.setTimeout(() => {
      openTimer.current = null;
      if (!isOpenRequested(activity.current)) {
        return;
      }
      setShown(true);
    }, readDuration(delayToken.open));
  }

  function requestClose() {
    clearTimer(openTimer);
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

  const trigger: ReactElement<TriggerProps> = children ? (
    applyTriggerProps(Children.only(children), naming, tooltipId)
  ) : (
    <button
      type="button"
      className={styles.trigger}
      {...defaultTriggerAria(
        naming,
        tooltipId,
        resolveTriggerLabel(label, naming),
      )}
    >
      <Icon name="info" />
    </button>
  );

  return (
    <span
      ref={rootRef}
      className={styles.root}
      data-placement={placement}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {trigger}
      <span
        id={tooltipId}
        role="tooltip"
        className={styles.tooltip}
        hidden={!open}
      >
        {content}
      </span>
    </span>
  );
}
