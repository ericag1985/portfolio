import type { ComponentPropsWithRef } from 'react';

import type { IconName } from '../Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonIcon =
  IconName | { name: IconName; placement: 'start' | 'end' };

export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  /** Always required. Visible text, or the tooltip and accessible name when icon-only. */
  label: string;
  /** Default `primary`. `link` looks like a link but stays a `<button>`. */
  variant?: ButtonVariant;
  /** Default `md`. */
  size?: ButtonSize;
  /** A bare `IconName` makes the button icon-only. The object form puts the icon beside the label. */
  icon?: ButtonIcon;
};
