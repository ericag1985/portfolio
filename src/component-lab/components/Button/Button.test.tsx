import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';

import { cssCustomProperty } from '../../../test/tokens';
import { Button, type ButtonProps } from './index';

test('a text button has the button role and its label as name', () => {
  render(<Button label="Save" />);

  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
});

test('an icon beside the label is hidden from the name', () => {
  render(<Button label="Add" icon={{ name: 'plus', placement: 'end' }} />);

  const button = screen.getByRole('button', { name: 'Add' });
  expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
});

test('a bare icon makes an icon-only button named and described by the tooltip', () => {
  render(<Button label="More info" icon="info" />);

  const button = screen.getByRole('button', { name: 'More info' });
  expect(button).not.toHaveAccessibleDescription();
  expect(screen.getByRole('tooltip')).toHaveTextContent('More info');
  expect(button).toHaveAttribute('data-icon-only');
});

test('the icon-only tooltip opens on hover and focus', async () => {
  const user = userEvent.setup();
  render(<Button label="More info" icon="info" />);
  const root = screen.getByRole('tooltip').parentElement;
  const button = screen.getByRole('button', { name: 'More info' });

  await user.hover(button);
  expect(root).toHaveAttribute('data-state', 'open');
  await user.unhover(button);
  expect(root).toHaveAttribute('data-state', 'closed');

  await user.tab();
  expect(button).toHaveFocus();
  expect(root).toHaveAttribute('data-state', 'open');
});

test('click calls onClick', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(<Button label="Save" onClick={onClick} />);

  await user.click(screen.getByRole('button', { name: 'Save' }));
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('disabled blocks click', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(<Button label="Save" disabled onClick={onClick} />);

  const button = screen.getByRole('button', { name: 'Save' });
  expect(button).toBeDisabled();
  await user.click(button);
  expect(onClick).not.toHaveBeenCalled();
});

test('Enter and Space activate it', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(<Button label="Save" onClick={onClick} />);

  await user.tab();
  await user.keyboard('{Enter}');
  await user.keyboard(' ');
  expect(onClick).toHaveBeenCalledTimes(2);
});

test('type defaults to button and can be overridden', () => {
  render(
    <>
      <Button label="Default" />
      <Button label="Send" type="submit" />
    </>,
  );

  expect(screen.getByRole('button', { name: 'Default' })).toHaveAttribute(
    'type',
    'button',
  );
  expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute(
    'type',
    'submit',
  );
});

test('the ref reaches the button, also when icon-only', () => {
  const textRef = createRef<HTMLButtonElement>();
  const iconRef = createRef<HTMLButtonElement>();
  render(
    <>
      <Button label="Save" ref={textRef} />
      <Button label="More info" icon="info" ref={iconRef} />
    </>,
  );

  expect(textRef.current).toBe(screen.getByRole('button', { name: 'Save' }));
  expect(iconRef.current).toBe(
    screen.getByRole('button', { name: 'More info' }),
  );
});

test('size tokens output as rem', () => {
  expect(cssCustomProperty('--ds-button-md-min-height')).toBe('2.5rem');
  expect(cssCustomProperty('--ds-space-8')).toBe('2rem');
  expect(cssCustomProperty('--ds-space-12')).toBe('3rem');
});

test('label is required and children are not accepted', () => {
  // @ts-expect-error label is required
  const noLabel: ButtonProps = {};
  const children: ButtonProps = {
    label: 'Save',
    // @ts-expect-error the label is the only content
    children: 'Save',
  };

  expect([noLabel, children]).toHaveLength(2);
});
