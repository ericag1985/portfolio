import { cloneElement, type ReactElement } from 'react';

import {
  type TooltipNaming,
  type TooltipPlacement,
  type TriggerProps,
} from './types';

export const placements = [
  'top',
  'bottom',
  'start',
  'end',
] as const satisfies readonly TooltipPlacement[];

export const namings = [
  'description',
  'label',
] as const satisfies readonly TooltipNaming[];

export const delayToken = {
  open: '--ds-tooltip-delay-open',
  close: '--ds-tooltip-delay-close',
} as const;

export type TooltipActivity = {
  pointer: boolean;
  focus: boolean;
  /**
   * Escape hides the tooltip until both the pointer and keyboard focus
   * have left, so a still-hovered or still-focused trigger does not reopen it.
   */
  suppressed: boolean;
};

/**
 * The tooltip stays while the pointer is over the control or the trigger
 * has focus, unless Escape dismissed it. WCAG 2.2 1.4.13 persistent.
 */
export function isOpenRequested(activity: TooltipActivity): boolean {
  return !activity.suppressed && (activity.pointer || activity.focus);
}

/**
 * Name for the default info button. `naming="label"` takes the name from
 * the tooltip instead, so an empty label is allowed in that mode.
 */
export function resolveTriggerLabel(
  label: string | undefined,
  naming: TooltipNaming,
): string | undefined {
  if (naming === 'label') {
    return undefined;
  }

  const name = label?.trim() ?? '';
  if (name.length === 0) {
    throw new Error(
      'The default info button needs a label. Pass label, set naming to "label", or pass a child trigger.',
    );
  }
  return name;
}

/** Keep an id a caller already set and append the tooltip id once. */
export function joinIds(existing: string | undefined, id: string): string {
  const ids = existing?.split(/\s+/).filter(Boolean) ?? [];
  if (ids.includes(id)) {
    return ids.join(' ');
  }
  return [...ids, id].join(' ');
}

export function readDuration(name: string): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Expected ${name} to be a duration, received "${raw}".`);
  }
  if (raw.endsWith('ms')) {
    return value;
  }
  if (raw.endsWith('s')) {
    return value * 1000;
  }
  return value;
}

export function clearTimer(timer: { current: number | null }) {
  if (timer.current !== null) {
    window.clearTimeout(timer.current);
    timer.current = null;
  }
}

export function defaultTriggerAria(
  naming: TooltipNaming,
  tooltipId: string,
  label: string | undefined,
): {
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  'aria-label'?: string;
} {
  if (naming === 'label') {
    return { 'aria-labelledby': tooltipId };
  }
  return { 'aria-describedby': tooltipId, 'aria-label': label };
}

/**
 * Adds the tooltip id to an existing describedby or labelledby list
 * instead of replacing it. The child's own handlers stay in place.
 */
export function applyTriggerProps(
  child: ReactElement<TriggerProps>,
  naming: TooltipNaming,
  tooltipId: string,
): ReactElement<TriggerProps> {
  const relationship =
    naming === 'label' ? 'aria-labelledby' : 'aria-describedby';
  return cloneElement(child, {
    [relationship]: joinIds(child.props[relationship], tooltipId),
  });
}
