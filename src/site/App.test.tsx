import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';

import { App } from './App';
import { themeStorageKey } from './theme';

let systemPrefersDark = false;
let mediaListener: ((event: Event) => void) | undefined;

function mockMatchMedia(prefersDark: boolean) {
  systemPrefersDark = prefersDark;
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      get matches() {
        return systemPrefersDark;
      },
      media: query,
      addEventListener: (_type: string, listener: (event: Event) => void) => {
        mediaListener = listener;
      },
      removeEventListener: () => {
        mediaListener = undefined;
      },
    }),
  });
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  mediaListener = undefined;
  mockMatchMedia(false);
});

test('renders the portfolio heading and Storybook link', async () => {
  const user = userEvent.setup();

  render(<App />);

  expect(
    screen.getByRole('heading', { level: 1, name: 'Portfolio' }),
  ).toBeInTheDocument();

  const storybookLink = screen.getByRole('link', {
    name: 'Design system in Storybook',
  });

  expect(storybookLink).toHaveAttribute(
    'href',
    `${import.meta.env.BASE_URL}storybook/`,
  );

  await user.tab();
  expect(screen.getByRole('button', { name: 'Dark theme' })).toHaveFocus();

  await user.tab();
  expect(storybookLink).toHaveFocus();
});

test('theme toggle persists the choice and overrides the system theme', async () => {
  const user = userEvent.setup();
  mockMatchMedia(false);

  render(<App />);

  const toggle = screen.getByRole('button', { name: 'Dark theme' });
  expect(toggle).toHaveAttribute('aria-pressed', 'false');
  expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  expect(localStorage.getItem(themeStorageKey)).toBeNull();

  await user.click(toggle);

  expect(toggle).toHaveAttribute('aria-pressed', 'true');
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  expect(localStorage.getItem(themeStorageKey)).toBe('dark');

  await user.click(toggle);

  expect(toggle).toHaveAttribute('aria-pressed', 'false');
  expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  expect(localStorage.getItem(themeStorageKey)).toBe('light');
});

test('the toggle still switches the theme when storage is blocked', async () => {
  const user = userEvent.setup();
  const setItem = vi
    .spyOn(Storage.prototype, 'setItem')
    .mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });

  try {
    render(<App />);
    const toggle = screen.getByRole('button', { name: 'Dark theme' });

    await user.click(toggle);

    expect(setItem).toHaveBeenCalled();
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  } finally {
    setItem.mockRestore();
  }
});

test('uses the system dark theme until a choice is stored', () => {
  mockMatchMedia(true);

  render(<App />);

  const toggle = screen.getByRole('button', { name: 'Dark theme' });
  expect(toggle).toHaveAttribute('aria-pressed', 'true');
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  expect(localStorage.getItem(themeStorageKey)).toBeNull();

  act(() => {
    systemPrefersDark = false;
    mediaListener?.(new Event('change'));
  });

  expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  expect(toggle).toHaveAttribute('aria-pressed', 'false');
});

test('a stored theme overrides the system preference', () => {
  localStorage.setItem(themeStorageKey, 'light');
  mockMatchMedia(true);

  render(<App />);

  expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  expect(screen.getByRole('button', { name: 'Dark theme' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});
