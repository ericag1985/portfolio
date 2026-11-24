import { managedPropNames, type IconSize, type IconSvgProps } from './types';

/** Width and height for each icon size, from the `--ds-icon-size-*` tokens. */
export const sizeToken = {
  sm: 'var(--ds-icon-size-sm)',
  md: 'var(--ds-icon-size-md)',
  lg: 'var(--ds-icon-size-lg)',
} as const satisfies Record<IconSize, string>;

export const iconSizes = Object.keys(sizeToken) as IconSize[];

const blockedProps = new Set<string>(managedPropNames);

/**
 * Lucide copies leftover props onto the svg after `stroke={color}`, so a
 * passed `stroke`, `width`, or `height` would replace `currentColor` and the
 * token size. Drop those, plus the props that set the accessible name.
 */
export function passThrough(props: IconSvgProps): IconSvgProps {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !blockedProps.has(key)),
  );
}
