import type { Ref, SVGProps } from 'react';

import styles from './Icon.module.css';
import { icons, type IconName } from './icons';

export type { IconName } from './icons';

export const iconSizes = ['sm', 'md', 'lg'] as const;

export type IconSize = (typeof iconSizes)[number];

const sizeToken = {
  sm: 'var(--ds-icon-size-sm)',
  md: 'var(--ds-icon-size-md)',
  lg: 'var(--ds-icon-size-lg)',
} as const satisfies Record<IconSize, string>;

type ManagedProp =
  | 'aria-hidden'
  | 'aria-label'
  | 'aria-labelledby'
  | 'children'
  | 'color'
  | 'focusable'
  | 'height'
  | 'role'
  | 'stroke'
  | 'width';

type IconSvgProps = Omit<
  SVGProps<SVGSVGElement>,
  ManagedProp | 'name' | 'ref' | 'size'
>;

export type IconProps = IconSvgProps & {
  name: IconName;
  size?: IconSize;
  label?: string;
  ref?: Ref<SVGSVGElement>;
};

// Lucide applies leftover props after `stroke={color}`, so these have to be
// removed or they can replace currentColor and the accessible name.
const managedPropNames: readonly ManagedProp[] = [
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
];

const blockedProps = new Set<string>(managedPropNames);

function passThrough(props: IconSvgProps): IconSvgProps {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !blockedProps.has(key)),
  );
}

export function Icon({
  name,
  size = 'md',
  label,
  className,
  style,
  ref,
  ...rest
}: IconProps) {
  const Glyph = icons[name];
  const accessibleName = label?.trim() ?? '';
  const labelled = accessibleName.length > 0;
  const dimension = sizeToken[size];

  return (
    <Glyph
      ref={ref}
      className={[styles.icon, className].filter(Boolean).join(' ')}
      color="currentColor"
      size={dimension}
      focusable="false"
      {...passThrough(rest)}
      style={{ ...style, width: dimension, height: dimension }}
      {...(labelled
        ? { role: 'img', 'aria-label': accessibleName }
        : { 'aria-hidden': true })}
    />
  );
}
