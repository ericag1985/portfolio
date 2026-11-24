import type { Ref, SVGProps } from 'react';

export type IconName = 'plus' | 'trash' | 'settings' | 'info' | 'arrow-right';

export type IconSize = 'sm' | 'md' | 'lg';

export type ManagedProp =
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

export type IconSvgProps = Omit<
  SVGProps<SVGSVGElement>,
  ManagedProp | 'name' | 'ref' | 'size'
>;

export type IconProps = IconSvgProps & {
  name: IconName;
  size?: IconSize;
  label?: string;
  ref?: Ref<SVGSVGElement>;
};
