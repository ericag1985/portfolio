import type { Ref, SVGProps } from 'react';

export type IconName = 'plus' | 'trash' | 'settings' | 'info' | 'arrow-right';

export type IconSize = 'sm' | 'md' | 'lg';

export const managedPropNames = [
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
] as const;

export type ManagedProp = (typeof managedPropNames)[number];

export type IconSvgProps = Omit<
  SVGProps<SVGSVGElement>,
  ManagedProp | 'name' | 'ref' | 'size'
>;

export type IconProps = IconSvgProps & {
  name: IconName;
  size?: IconSize;
  /**
   * Accessible name. Omit it, or pass a blank string, and the icon is
   * decorative: `aria-hidden`, not focusable, and no role. A non-blank
   * label exposes the icon as `role="img"` with that name.
   */
  label?: string;
  ref?: Ref<SVGSVGElement>;
};
