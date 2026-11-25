import type { ButtonSize, ButtonVariant } from './types';

export const variants = [
  'primary',
  'secondary',
  'destructive',
  'link',
] as const satisfies readonly ButtonVariant[];

export const sizes = [
  'sm',
  'md',
  'lg',
] as const satisfies readonly ButtonSize[];
