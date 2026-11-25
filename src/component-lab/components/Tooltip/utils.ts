import { cloneElement, type ReactElement } from 'react';

import type { TooltipNaming, TooltipPlacement, TriggerProps } from './types';

export const placements = [
  'top',
  'bottom',
] as const satisfies readonly TooltipPlacement[];

export const namings = [
  'description',
  'label',
] as const satisfies readonly TooltipNaming[];

/**
 * Minimum gap between the bubble and a viewport edge, in px. Matches
 * `--ds-space-4` (1rem), which the CSS max-width uses. A unit test asserts
 * that token so the two can't drift.
 */
export const viewportMargin = 16;

/**
 * Horizontal shift in px that keeps an un-nudged bubble at least `margin`
 * from both viewport edges. A bubble wider than the space aligns to the
 * left margin.
 */
export function viewportNudge(
  rect: Pick<DOMRect, 'left' | 'right'>,
  viewportWidth: number,
  margin: number,
): number {
  const pastRight = Math.min(0, viewportWidth - margin - rect.right);
  return Math.max(margin - rect.left, pastRight);
}

/** Keep an id a caller already set and append the tooltip id once. */
export function joinIds(existing: string | undefined, id: string): string {
  const ids = existing?.split(/\s+/).filter(Boolean) ?? [];
  if (ids.includes(id)) {
    return ids.join(' ');
  }
  return [...ids, id].join(' ');
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
