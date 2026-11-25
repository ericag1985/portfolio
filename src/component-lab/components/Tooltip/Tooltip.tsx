import { Children, useId } from 'react';

import styles from './Tooltip.module.css';
import type { TooltipProps } from './types';
import { useTooltip } from './useTooltip';
import { applyTriggerProps } from './utils';

/**
 * Supplementary text for one focusable trigger, shown on hover or focus.
 *
 * Never put information in a tooltip that isn't available some other way.
 * iOS doesn't focus a button on tap, so touch users there may never see it.
 * That's why there is no tap-to-pin mode.
 *
 * WCAG 2.2 1.4.13: the bubble is hoverable (it sits inside the root, with a
 * bridge over the gap), persistent while hovered or focused, and dismissible
 * with Escape. See `useTooltip`.
 */
export function Tooltip({
  content,
  naming = 'description',
  placement = 'top',
  children,
}: TooltipProps) {
  const tooltipId = useId();
  const { rootRef, bubbleRef, state, ...handlers } = useTooltip();

  return (
    <span
      ref={rootRef}
      className={styles.root}
      data-placement={placement}
      data-state={state}
      {...handlers}
    >
      {applyTriggerProps(Children.only(children), naming, tooltipId)}
      <span
        ref={bubbleRef}
        id={tooltipId}
        role="tooltip"
        className={styles.tooltip}
      >
        {content}
      </span>
    </span>
  );
}
