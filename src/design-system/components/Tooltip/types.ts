import type { ReactElement } from 'react';

/** Only top and bottom: a side placement can't stay inside a narrow viewport. */
export type TooltipPlacement = 'top' | 'bottom';

/**
 * `description` points the trigger at the tooltip with `aria-describedby`.
 * `label` uses `aria-labelledby`, so an icon-only control is named by the
 * tooltip and that name is read once.
 */
export type TooltipNaming = 'description' | 'label';

/** The aria lists the tooltip appends its id to. */
export type TriggerProps = {
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
};

export type TooltipProps = {
  /** Supplementary text. See the component JSDoc for the rule. */
  content: string;
  /** `description` → aria-describedby (default). `label` → aria-labelledby. */
  naming?: TooltipNaming;
  /** Default `top`. */
  placement?: TooltipPlacement;
  /** One focusable element. It receives the aria relationship. */
  children: ReactElement<TriggerProps>;
};
