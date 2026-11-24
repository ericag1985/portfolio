import { isInaccessible } from '@testing-library/dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';

import { cssCustomProperty } from '../../../test/tokens';
import { Icon } from '../Icon';
import {
  Tooltip,
  placements,
  type TooltipPlacement,
  type TooltipProps,
} from './index';

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function delayMs(name: string): number {
  const raw = cssCustomProperty(name);
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) {
    throw new Error(`Expected ${name} to be a duration, received "${raw}".`);
  }
  return raw.endsWith('s') && !raw.endsWith('ms') ? value * 1000 : value;
}

test('the default trigger is an info button named by label', () => {
  const { container } = render(
    <Tooltip content="Details" label=" More information " />,
  );
  const button = screen.getByRole('button', { name: 'More information' });
  const icon = container.querySelector('svg');

  expect(button).toHaveAttribute('type', 'button');
  expect(icon).not.toBeNull();
  expect(isInaccessible(icon as Element)).toBe(true);
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('a blank label warns in development instead of throwing', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

  render(<Tooltip content="Details" label="  " />);
  expect(screen.getByRole('button')).not.toHaveAttribute('aria-label');
  expect(warn).toHaveBeenCalledOnce();
  expect(warn.mock.calls[0]?.[0]).toMatch(/label/);

  warn.mockRestore();
});

test('the tooltip names the default trigger without a label or warning', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

  render(<Tooltip content="Details" naming="label" />);
  expect(screen.getByRole('button', { name: 'Details' })).toBeInTheDocument();
  expect(warn).not.toHaveBeenCalled();

  warn.mockRestore();
});

test('label is required only for the described default trigger', () => {
  const props: TooltipProps[] = [
    { content: 'Details', label: 'More information' },
    { content: 'Details', naming: 'label' },
    { content: 'Details', children: <button type="button">Save</button> },
  ];
  // @ts-expect-error the default info button described by the tooltip needs a label
  const missingLabel: TooltipProps = { content: 'Details' };
  // @ts-expect-error naming description still needs a label
  const describedMissingLabel: TooltipProps = {
    content: 'Details',
    naming: 'description',
  };
  expect(props).toHaveLength(3);
  expect(missingLabel.content).toBe(describedMissingLabel.content);
});

test('describes the trigger with a stable tooltip id', () => {
  render(<Tooltip content="Details" label="More information" />);
  const button = screen.getByRole('button', { name: 'More information' });
  const tooltip = screen.getByRole('tooltip', { hidden: true });

  expect(tooltip).toHaveAttribute('role', 'tooltip');
  expect(tooltip.id).not.toBe('');
  expect(button).toHaveAttribute('aria-describedby', tooltip.id);
  expect(button).not.toHaveAttribute('aria-labelledby');
  expect(button).toHaveAccessibleDescription('Details');
});

test('names the trigger with aria-labelledby when naming is label', () => {
  render(
    <Tooltip content="Delete item" naming="label">
      <button type="button">
        <Icon name="trash" />
      </button>
    </Tooltip>,
  );
  const button = screen.getByRole('button', { name: 'Delete item' });
  const tooltip = screen.getByRole('tooltip', { hidden: true });

  expect(button).toHaveAttribute('aria-labelledby', tooltip.id);
  expect(button).not.toHaveAttribute('aria-describedby');
  expect(button).not.toHaveAttribute('aria-label');
  expect(button).toHaveAccessibleName('Delete item');
  expect(button).not.toHaveAccessibleDescription();
});

test('keeps an existing aria relationship and the child click handler', async () => {
  const user = userEvent.setup();
  let clicks = 0;

  render(
    <Tooltip content="Saved">
      <button
        type="button"
        aria-describedby="hint"
        onClick={() => {
          clicks += 1;
        }}
      >
        Save
      </button>
    </Tooltip>,
  );
  const button = screen.getByRole('button', { name: 'Save' });
  const tooltip = screen.getByRole('tooltip', { hidden: true });

  expect(button).toHaveAttribute('aria-describedby', `hint ${tooltip.id}`);
  await user.click(button);
  expect(clicks).toBe(1);
});

test('placement is a positioned side and defaults to top', () => {
  const { unmount } = render(
    <Tooltip content="Details" label="More information" />,
  );
  expect(
    screen.getByRole('tooltip', { hidden: true }).parentElement,
  ).toHaveAttribute('data-placement', 'top');
  unmount();

  for (const placement of placements) {
    const view = render(
      <Tooltip
        content="Details"
        label="More information"
        placement={placement}
      />,
    );
    expect(
      screen.getByRole('tooltip', { hidden: true }).parentElement,
    ).toHaveAttribute('data-placement', placement);
    view.unmount();
  }
});

test('hover and focus open after the delay, and pointer leave closes', async () => {
  const user = userEvent.setup();
  const openDelay = delayMs('--ds-tooltip-delay-open');
  const closeDelay = delayMs('--ds-tooltip-delay-close');

  expect(openDelay).toBeGreaterThan(0);
  expect(closeDelay).toBeGreaterThan(0);

  render(
    <>
      <Tooltip content="Details" label="More information" />
      <button type="button">After</button>
    </>,
  );
  const button = screen.getByRole('button', { name: 'More information' });

  await user.hover(button);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Details');

  await user.unhover(button);
  expect(screen.getByRole('tooltip')).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  await user.tab();
  expect(button).toHaveFocus();
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Details');

  await user.tab();
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  expect(screen.getByRole('tooltip')).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});

test('hovering the tooltip keeps it open', async () => {
  const user = userEvent.setup();
  const closeDelay = delayMs('--ds-tooltip-delay-close');

  render(<Tooltip content="Details" label="More information" />);
  const button = screen.getByRole('button', { name: 'More information' });

  await user.hover(button);
  const tooltip = await screen.findByRole('tooltip');
  await user.hover(tooltip);
  await wait(closeDelay + 80);

  expect(screen.getByRole('tooltip')).toHaveTextContent('Details');
  expect(button).not.toHaveFocus();
});

test('Escape dismisses without moving focus and does not reopen until focus returns', async () => {
  const user = userEvent.setup();
  const openDelay = delayMs('--ds-tooltip-delay-open');

  render(
    <>
      <Tooltip content="Details" label="More information" />
      <button type="button">After</button>
    </>,
  );
  const button = screen.getByRole('button', { name: 'More information' });

  await user.tab();
  expect(await screen.findByRole('tooltip')).toBeInTheDocument();
  await user.keyboard('{Escape}');

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(button).toHaveFocus();
  await wait(openDelay + 80);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(button).toHaveFocus();

  await user.tab();
  await user.tab({ shift: true });
  expect(button).toHaveFocus();
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Details');
});

test('Escape during the open delay reaches the focused control', async () => {
  const user = userEvent.setup();
  const openDelay = delayMs('--ds-tooltip-delay-open');
  let escapes = 0;

  render(
    <>
      <input
        aria-label="Name"
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            escapes += 1;
          }
        }}
      />
      <Tooltip content="Details" label="More information" />
    </>,
  );
  const input = screen.getByRole('textbox', { name: 'Name' });
  const trigger = screen.getByRole('button', { name: 'More information' });

  await user.click(input);
  await user.hover(trigger);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  await user.keyboard('{Escape}');

  expect(escapes).toBe(1);
  expect(input).toHaveFocus();
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  await wait(openDelay + 80);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

async function tap(
  user: ReturnType<typeof userEvent.setup>,
  target: HTMLElement,
) {
  await user.pointer([{ keys: '[TouchA>]', target }, { keys: '[/TouchA]' }]);
}

test('a touch tap toggles the default trigger and a tap outside closes it', async () => {
  const user = userEvent.setup();

  render(
    <>
      <Tooltip content="Details" label="More information" />
      <button type="button">Outside</button>
    </>,
  );
  const trigger = screen.getByRole('button', { name: 'More information' });
  const outside = screen.getByRole('button', { name: 'Outside' });

  await tap(user, trigger);
  expect(screen.getByRole('tooltip')).toHaveTextContent('Details');

  await tap(user, trigger);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  await tap(user, trigger);
  expect(screen.getByRole('tooltip')).toBeInTheDocument();
  await user.pointer({ keys: '[TouchA]', target: outside });
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('a touch tap that focuses the trigger still pins it, and Enter does not toggle it', async () => {
  const user = userEvent.setup();

  render(<Tooltip content="Details" label="More information" />);
  const trigger = screen.getByRole('button', { name: 'More information' });

  // Android Chrome order: pointerdown, then focus, then click, with
  // microtasks running between them.
  await user.pointer({ keys: '[TouchA>]', target: trigger });
  act(() => {
    trigger.focus();
  });
  await Promise.resolve();
  await user.pointer({ keys: '[/TouchA]', target: trigger });

  expect(trigger).toHaveFocus();
  expect(screen.getByRole('tooltip')).toHaveTextContent('Details');

  await user.keyboard('{Enter}');
  expect(screen.getByRole('tooltip')).toHaveTextContent('Details');
});

test('a touch tap does not toggle a custom trigger', async () => {
  const user = userEvent.setup();
  let clicks = 0;

  render(
    <Tooltip content="Saved">
      <button
        type="button"
        onClick={() => {
          clicks += 1;
        }}
      >
        Save
      </button>
    </Tooltip>,
  );
  const button = screen.getByRole('button', { name: 'Save' });

  await tap(user, button);

  expect(clicks).toBe(1);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('Escape dismisses a hover-opened tooltip when focus is elsewhere', async () => {
  const user = userEvent.setup();
  const openDelay = delayMs('--ds-tooltip-delay-open');

  render(
    <>
      <button type="button">Elsewhere</button>
      <Tooltip content="Details" label="More information" />
    </>,
  );
  const elsewhere = screen.getByRole('button', { name: 'Elsewhere' });
  const trigger = screen.getByRole('button', { name: 'More information' });

  await user.tab();
  expect(elsewhere).toHaveFocus();
  await user.hover(trigger);
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Details');
  expect(elsewhere).toHaveFocus();

  await user.keyboard('{Escape}');
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(elsewhere).toHaveFocus();
  await wait(openDelay + 80);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  await user.unhover(trigger);
  await user.hover(trigger);
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Details');
});

test('stays open while either the pointer or focus remains', async () => {
  const user = userEvent.setup();
  const closeDelay = delayMs('--ds-tooltip-delay-close');

  render(
    <>
      <Tooltip content="Details" label="More information" />
      <button type="button">After</button>
    </>,
  );
  const button = screen.getByRole('button', { name: 'More information' });

  await user.hover(button);
  await screen.findByRole('tooltip');
  await user.tab();
  expect(button).toHaveFocus();
  await user.tab();
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  await wait(closeDelay + 80);
  expect(screen.getByRole('tooltip')).toBeInTheDocument();

  await user.unhover(button);
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});

test('tooltip tokens follow light and dark', () => {
  const root = document.documentElement;

  expect(cssCustomProperty('--ds-tooltip-delay-open')).toBe('200ms');
  expect(cssCustomProperty('--ds-tooltip-delay-close')).toBe('100ms');
  expect(cssCustomProperty('--ds-tooltip-font-size')).toBe('0.875rem');
  expect(cssCustomProperty('--ds-tooltip-caret-size')).toBe('0.5rem');

  try {
    root.dataset.theme = 'light';
    expect(cssCustomProperty('--ds-tooltip-background')).toBe('#1d1d1d');
    expect(cssCustomProperty('--ds-tooltip-color')).toBe('#fafafa');

    root.dataset.theme = 'dark';
    expect(cssCustomProperty('--ds-tooltip-background')).toBe('#fafafa');
    expect(cssCustomProperty('--ds-tooltip-color')).toBe('#1d1d1d');
  } finally {
    delete root.dataset.theme;
  }
});

function assertPlacement(placement: TooltipPlacement) {
  return placement;
}

test('placement outside the union is a type error', () => {
  expect(placements).toEqual(['top', 'bottom', 'start', 'end']);
  // @ts-expect-error left is not a tooltip placement
  assertPlacement('left');
});
