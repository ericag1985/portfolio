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

/**
 * The default info-icon button described by the tooltip. It has no visible
 * text, so `label` is its accessible name and is required.
 */
export type DescribedInfoTooltipProps = {
  /** Text shown in the tooltip. */
  content: string;
  /** Accessible name of the info-icon button. */
  label: string;
  /** How the trigger refers to the tooltip. Defaults to `description`. */
  naming?: 'description';
  /** Which side of the trigger the tooltip sits on. Defaults to `top`. */
  placement?: TooltipPlacement;
  children?: undefined;
};

/**
 * The default info-icon button named by the tooltip with `aria-labelledby`.
 * The tooltip text is the name, so `label` is not used.
 */
export type LabelledInfoTooltipProps = {
  /** Text shown in the tooltip. */
  content: string;
  /** Not used. The tooltip names the button. */
  label?: string;
  naming: 'label';
  /** Which side of the trigger the tooltip sits on. Defaults to `top`. */
  placement?: TooltipPlacement;
  children?: undefined;
};

/** A custom trigger, which brings its own accessible name. */
export type CustomTriggerTooltipProps = {
  /** Text shown in the tooltip. */
  content: string;
  /** Not used. The child trigger has its own name. */
  label?: string;
  /** How the trigger refers to the tooltip. Defaults to `description`. */
  naming?: TooltipNaming;
  /** Which side of the trigger the tooltip sits on. Defaults to `top`. */
  placement?: TooltipPlacement;
  /**
   * One element that can take the aria relationship and receive keyboard
   * focus.
   */
  children: ReactElement<TriggerProps>;
};

/**
 * `label` is required only for the default info button described by the
 * tooltip. A child trigger or `naming="label"` already gives the trigger a
 * name.
 */
export type TooltipProps =
  | DescribedInfoTooltipProps
  | LabelledInfoTooltipProps
  | CustomTriggerTooltipProps;
