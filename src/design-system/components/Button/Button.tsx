import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import styles from './Button.module.css';
import type { ButtonProps } from './types';

/**
 * A native `<button>` with four variants, three sizes, and an icon-only mode.
 *
 * `label` is always required. A bare icon name makes the button icon-only:
 * it wraps itself in a Tooltip with `naming="label"`, so the label is both the
 * tooltip and the accessible name. Icons next to text are decorative.
 *
 * `type` defaults to `"button"` so it never submits a form by accident.
 * Icon placement uses flex order, so start and end follow the writing
 * direction in RTL.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  type = 'button',
  className,
  ...rest
}: ButtonProps) {
  const iconOnly = typeof icon === 'string';
  const iconName = typeof icon === 'string' ? icon : icon?.name;
  const placement = typeof icon === 'object' ? icon.placement : 'start';
  const glyph = iconName ? <Icon name={iconName} size={size} /> : null;

  const button = (
    <button
      {...rest}
      type={type}
      className={[styles.button, className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-size={size}
      data-icon-only={iconOnly || undefined}
    >
      {iconOnly ? (
        glyph
      ) : (
        <>
          {placement === 'start' && glyph}
          {label}
          {placement === 'end' && glyph}
        </>
      )}
    </button>
  );

  return iconOnly ? (
    <Tooltip content={label} naming="label">
      {button}
    </Tooltip>
  ) : (
    button
  );
}
