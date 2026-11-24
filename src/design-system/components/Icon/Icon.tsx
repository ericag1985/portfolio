import styles from './Icon.module.css';
import { icons } from './icons';
import type { IconProps } from './types';
import { passThrough, sizeToken } from './utils';

/**
 * An allowlisted Lucide icon. It inherits text color through `currentColor`.
 * See `label` for when the icon is decorative and when it is named.
 */
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
