import type { KeyboardEvent, ReactElement } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'start' | 'end';

/**
 * `description` points the trigger at the tooltip with `aria-describedby`.
 * `label` uses `aria-labelledby`, so an icon-only control is named by the
 * tooltip and that name is read once.
 */
export type TooltipNaming = 'description' | 'label';

export type TriggerProps = {
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
};

export type TooltipProps = {
  /** Text shown in the tooltip. */
  content: string;
  /**
   * Accessible name of the default info-icon button. Required when no child
   * trigger is passed and `naming` is `description`. Ignored when `naming`
   * is `label`, because the tooltip names that button.
   */
  label?: string;
  /** How the trigger refers to the tooltip. Defaults to `description`. */
  naming?: TooltipNaming;
  /** Which side of the trigger the tooltip sits on. Defaults to `top`. */
  placement?: TooltipPlacement;
  /**
   * Custom trigger. One element that can take the aria relationship and
   * receive keyboard focus. Omit it to use the info-icon button.
   */
  children?: ReactElement<TriggerProps>;
};
