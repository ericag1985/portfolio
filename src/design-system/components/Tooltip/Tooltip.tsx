import { Children, useId, type ReactElement } from 'react';

import { Icon } from '../Icon';
import styles from './Tooltip.module.css';
import type { TooltipProps, TriggerProps } from './types';
import { useTooltip } from './useTooltip';
import {
  applyTriggerProps,
  defaultTriggerAria,
  resolveTriggerLabel,
} from './utils';

/**
 * Short text shown on hover or focus. Placement is CSS next to the trigger.
 * Placement is fixed and is not flipped near viewport edges.
 * See `useTooltip` for dismiss and persistence.
 */
export function Tooltip({
  content,
  label,
  naming = 'description',
  placement = 'top',
  children,
}: TooltipProps) {
  const tooltipId = useId();
  const {
    open,
    rootRef,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    onFocus,
    onBlur,
    onTriggerClick,
  } = useTooltip();

  const trigger: ReactElement<TriggerProps> = children ? (
    applyTriggerProps(Children.only(children), naming, tooltipId)
  ) : (
    <button
      type="button"
      className={styles.trigger}
      onClick={onTriggerClick}
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
      onPointerDown={onPointerDown}
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
