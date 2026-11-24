import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { cssCustomProperty } from '../../../test/tokens';
import { Icon } from '../Icon';
import { Tooltip, type TooltipProps } from './index';
import { viewportMargin, viewportNudge } from './utils';

function tooltipState() {
  return screen.getByRole('tooltip').parentElement?.dataset.state;
}

test('by default the tooltip describes the trigger', () => {
  render(
    <Tooltip content="Saves a draft">
      <button type="button">Save</button>
    </Tooltip>,
  );

  const button = screen.getByRole('button', { name: 'Save' });
  expect(button).toHaveAccessibleDescription('Saves a draft');
});

test('naming="label" makes the tooltip the trigger name', () => {
  render(
    <Tooltip content="Delete item" naming="label">
      <button type="button">
        <Icon name="trash" />
      </button>
    </Tooltip>,
  );

  const button = screen.getByRole('button', { name: 'Delete item' });
  expect(button).not.toHaveAccessibleDescription();
});

test('keeps existing aria ids, appends its own once, and keeps the child onClick', async () => {
  const user = userEvent.setup();
  let clicks = 0;

  render(
    <>
      <span id="hint">Ctrl+S</span>
      <span id="name">Save</span>
      <Tooltip content="Saves a draft">
        <button
          type="button"
          aria-describedby="hint"
          onClick={() => {
            clicks += 1;
          }}
        >
          Save
        </button>
      </Tooltip>
      <Tooltip content="Now" naming="label">
        <button type="button" aria-labelledby="name">
          <Icon name="plus" />
        </button>
      </Tooltip>
    </>,
  );

  const described = screen.getByRole('button', { name: 'Save' });
  expect(described).toHaveAccessibleDescription('Ctrl+S Saves a draft');
  expect(described.getAttribute('aria-describedby')?.split(' ')).toHaveLength(
    2,
  );
  expect(screen.getByRole('button', { name: 'Save Now' })).toBeInTheDocument();

  await user.click(described);
  expect(clicks).toBe(1);
});

test('the tooltip has role tooltip and a stable id', () => {
  const view = render(
    <Tooltip content="Saves a draft">
      <button type="button">Save</button>
    </Tooltip>,
  );
  const { id } = screen.getByRole('tooltip');

  view.rerender(
    <Tooltip content="Saves a draft">
      <button type="button">Save</button>
    </Tooltip>,
  );

  expect(id).not.toBe('');
  expect(screen.getByRole('tooltip')).toHaveAttribute('id', id);
});

test('hover and focus open it, and leaving closes it', async () => {
  const user = userEvent.setup();

  render(
    <Tooltip content="Saves a draft">
      <button type="button">Save</button>
    </Tooltip>,
  );
  const button = screen.getByRole('button', { name: 'Save' });
  expect(tooltipState()).toBe('closed');

  await user.hover(button);
  expect(tooltipState()).toBe('open');
  await user.unhover(button);
  expect(tooltipState()).toBe('closed');

  await user.tab();
  expect(button).toHaveFocus();
  expect(tooltipState()).toBe('open');
  await user.tab();
  expect(tooltipState()).toBe('closed');
});

test('Escape dismisses without moving focus or swallowing the key', async () => {
  const user = userEvent.setup();
  const escapes: string[] = [];

  render(
    <>
      <Tooltip content="Saves a draft">
        <button
          type="button"
          onKeyDown={(event) => {
            escapes.push(event.key);
          }}
        >
          Save
        </button>
      </Tooltip>
      <button type="button">After</button>
    </>,
  );
  const button = screen.getByRole('button', { name: 'Save' });

  await user.tab();
  expect(tooltipState()).toBe('open');
  await user.keyboard('{Escape}');

  expect(tooltipState()).toBe('dismissed');
  expect(button).toHaveFocus();
  expect(escapes).toEqual(['Escape']);

  await user.tab();
  await user.tab({ shift: true });
  expect(button).toHaveFocus();
  expect(tooltipState()).toBe('open');
});

test('viewportNudge keeps the bubble inside the margins', () => {
  const width = 400;
  const margin = 16;

  expect(viewportNudge({ left: 100, right: 200 }, width, margin)).toBe(0);
  expect(viewportNudge({ left: -20, right: 80 }, width, margin)).toBe(36);
  expect(viewportNudge({ left: 330, right: 430 }, width, margin)).toBe(-46);
  expect(viewportNudge({ left: 0, right: 500 }, width, margin)).toBe(16);
  expect(viewportNudge({ left: 50, right: 550 }, width, margin)).toBe(-34);
});

test('the viewport margin matches --ds-space-4', () => {
  expect(cssCustomProperty('--ds-space-4')).toBe('1rem');
  expect(viewportMargin).toBe(16);
});

test('a child trigger is required and placement is top or bottom', () => {
  // @ts-expect-error a child trigger is required
  const noChild: TooltipProps = { content: 'Details' };
  const start: TooltipProps = {
    content: 'Details',
    // @ts-expect-error start can't stay inside a narrow viewport
    placement: 'start',
    children: <button type="button">Save</button>,
  };

  expect([noChild, start]).toHaveLength(2);
});
