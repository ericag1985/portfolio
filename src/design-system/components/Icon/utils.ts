import type { IconSize, IconSvgProps, ManagedProp } from './types';

export const sizeToken = {
  sm: 'var(--ds-icon-size-sm)',
  md: 'var(--ds-icon-size-md)',
  lg: 'var(--ds-icon-size-lg)',
} as const satisfies Record<IconSize, string>;

export const iconSizes = Object.keys(sizeToken) as IconSize[];

const managedPropNames = [
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'children',
  'color',
  'focusable',
  'height',
  'role',
  'stroke',
  'width',
] as const satisfies readonly ManagedProp[];

type ManagedPropsCovered = ManagedProp extends (typeof managedPropNames)[number]
  ? true
  : never;

const blockedProps: ManagedPropsCovered extends true
  ? ReadonlySet<string>
  : never = new Set<string>(managedPropNames);

// Lucide applies leftover props after `stroke={color}`, so these have to be
// removed or they can replace currentColor and the accessible name.
export function passThrough(props: IconSvgProps): IconSvgProps {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !blockedProps.has(key)),
  );
}
