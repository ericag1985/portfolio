import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';

import { expectNoAxeViolations } from '../test/axe';
import { App } from './App';
import { aboutText, photoAlt } from './content';
import { certifications, employers } from './experience';
import { themeStorageKey } from './theme';

let systemPrefersDark = false;
let wideViewport = true;
let mediaListener: ((event: Event) => void) | undefined;

function mockMatchMedia(prefersDark: boolean) {
  systemPrefersDark = prefersDark;
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      get matches() {
        return query.includes('prefers-color-scheme')
          ? systemPrefersDark
          : wideViewport;
      },
      media: query,
      addEventListener: (_type: string, listener: (event: Event) => void) => {
        if (query.includes('prefers-color-scheme')) {
          mediaListener = listener;
        }
      },
      removeEventListener: () => {
        if (query.includes('prefers-color-scheme')) {
          mediaListener = undefined;
        }
      },
    }),
  });
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  mediaListener = undefined;
  wideViewport = true;
  mockMatchMedia(false);
});

const toggleName = /^Switch to (dark|light) theme$/;

test('has header, nav, and main landmarks and exactly one h1', () => {
  render(<App />);

  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('navigation')).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(
    screen.getByRole('heading', { level: 1, name: 'Erica Gugliemella' }),
  ).toBeInTheDocument();

  const main = within(screen.getByRole('main'));
  expect(
    main.getAllByRole('heading', { level: 2 }).map((h) => h.textContent),
  ).toEqual(['About', 'Experience', 'Component lab']);
});

test('the photo has the exact alt text, size, and a webp source', () => {
  const { container } = render(<App />);

  const photo = screen.getByRole('img', { name: photoAlt });
  expect(photo).toHaveAttribute('width', '800');
  expect(photo).toHaveAttribute('height', '800');
  expect(container.querySelector('picture source')).toHaveAttribute(
    'type',
    'image/webp',
  );

  for (const shape of container.querySelectorAll('.photo-shape')) {
    expect(shape).toHaveAttribute('aria-hidden', 'true');
  }
});

test('About uses the exact paragraph', () => {
  render(<App />);

  expect(screen.getByText(aboutText)).toBeInTheDocument();
  expect(aboutText).toBe(
    "I'm a front end engineer in Durham, NC who builds design systems and accessible components. For 14 years I've worked in React and TypeScript, and for 8 of those I've built the shared UI other teams build on. I'm CPACC certified, and I care most about making inclusive products the default.",
  );
});

test('Experience renders every employer, role, and bullet from the data', () => {
  render(<App />);

  expect(employers.map((e) => e.name)).toEqual([
    'ServiceTitan',
    'WillowTree',
    'Cloud Construct',
    'Isobar',
  ]);

  for (const employer of employers) {
    expect(
      screen.getByRole('heading', { level: 3, name: employer.name }),
    ).toBeInTheDocument();
    for (const role of employer.roles) {
      expect(
        screen.getAllByRole('heading', { level: 4, name: role.title }).length,
      ).toBeGreaterThan(0);
      for (const bullet of role.bullets) {
        expect(screen.getByText(bullet)).toBeInTheDocument();
      }
    }
  }

  expect(
    screen.getByText(
      `${certifications[0].name} - ${certifications[0].issuer}, ${certifications[0].year}`,
    ),
  ).toBeInTheDocument();
});

test('links to the committed resume PDF', () => {
  render(<App />);

  expect(
    screen.getByRole('link', { name: 'Download resume (PDF)' }),
  ).toHaveAttribute('href', `${import.meta.env.BASE_URL}resume.pdf`);
});

test('page text has no phone number, email, or street address', () => {
  const { container } = render(<App />);
  const text = container.textContent;

  expect(text).not.toMatch(/@[\w-]+\.\w+/);
  expect(text).not.toMatch(/\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/);
  expect(text).not.toMatch(
    /\d+\s+\w+\s+(street|st\.|avenue|ave\.|road|rd\.|drive|lane)\b/i,
  );
});

test('Component lab cards link to the published Storybook pages', () => {
  render(<App />);

  const base = `${import.meta.env.BASE_URL}storybook/`;
  const expected = {
    Tokens: '?path=/story/foundations-colors--default',
    Icon: '?path=/docs/design-system-icon--docs',
    Tooltip: '?path=/docs/design-system-tooltip--docs',
    Button: '?path=/docs/design-system-button--docs',
    'Spacing tokens': '?path=/story/foundations-spacing--default',
    'Typography tokens': '?path=/story/foundations-typography--default',
  };

  for (const [name, path] of Object.entries(expected)) {
    expect(screen.getByRole('link', { name })).toHaveAttribute(
      'href',
      `${base}${path}`,
    );
  }
});

test('GitHub and LinkedIn open in a new tab and say so', () => {
  render(<App />);

  for (const [name, href] of [
    ['GitHub (opens in a new tab)', 'https://github.com/ericag1985'],
    [
      'LinkedIn (opens in a new tab)',
      'https://www.linkedin.com/in/egugliemella',
    ],
  ]) {
    const link = screen.getByRole('link', { name });
    expect(link).toHaveAttribute('href', href);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer noopener');
  }
});

test('the nav marks the current section with aria-current', async () => {
  const user = userEvent.setup();
  render(<App />);

  const nav = within(screen.getByRole('navigation'));
  expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute(
    'aria-current',
    'true',
  );

  await user.click(nav.getByRole('link', { name: 'Experience' }));

  expect(nav.getByRole('link', { name: 'Experience' })).toHaveAttribute(
    'aria-current',
    'true',
  );
  expect(nav.getByRole('link', { name: 'About' })).not.toHaveAttribute(
    'aria-current',
  );
});

test('layout is wide or narrow from the breakpoint token', () => {
  const { container, unmount } = render(<App />);
  expect(container.querySelector('.layout')).toHaveAttribute(
    'data-layout',
    'wide',
  );
  unmount();

  wideViewport = false;
  const narrow = render(<App />);
  expect(narrow.container.querySelector('.layout')).toHaveAttribute(
    'data-layout',
    'narrow',
  );
});

test('tab order is skip link, sidebar, then main', async () => {
  const user = userEvent.setup();
  render(<App />);

  const order = [
    'Skip to main content',
    'About',
    'Experience',
    'Component lab',
    'GitHub (opens in a new tab)',
    'LinkedIn (opens in a new tab)',
    'Switch to dark theme',
    'Download resume (PDF)',
    'Tokens',
    'Spacing tokens',
    'Typography tokens',
    'Icon',
    'Tooltip',
    'Button',
  ];

  for (const name of order) {
    await user.tab();
    expect(document.activeElement).toHaveAccessibleName(name);
  }
});

test('the skip link moves focus to main', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.tab();
  await user.keyboard('{Enter}');

  expect(screen.getByRole('main')).toHaveFocus();
});

test('theme toggle works from the keyboard and persists the choice', async () => {
  const user = userEvent.setup();
  render(<App />);

  const toggle = screen.getByRole('button', { name: 'Switch to dark theme' });
  expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  expect(localStorage.getItem(themeStorageKey)).toBeNull();

  toggle.focus();
  await user.keyboard('{Enter}');

  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  expect(localStorage.getItem(themeStorageKey)).toBe('dark');
  expect(
    screen.getByRole('button', { name: 'Switch to light theme' }),
  ).toHaveFocus();

  await user.keyboard(' ');

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
    await user.click(screen.getByRole('button', { name: toggleName }));

    expect(setItem).toHaveBeenCalled();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  } finally {
    setItem.mockRestore();
  }
});

test('uses the system dark theme until a choice is stored', () => {
  mockMatchMedia(true);
  render(<App />);

  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  expect(
    screen.getByRole('button', { name: 'Switch to light theme' }),
  ).toBeInTheDocument();
  expect(localStorage.getItem(themeStorageKey)).toBeNull();

  act(() => {
    systemPrefersDark = false;
    mediaListener?.(new Event('change'));
  });

  expect(document.documentElement).toHaveAttribute('data-theme', 'light');
});

test('a stored theme overrides the system preference', () => {
  localStorage.setItem(themeStorageKey, 'light');
  mockMatchMedia(true);
  render(<App />);

  expect(document.documentElement).toHaveAttribute('data-theme', 'light');
});

test.each(['light', 'dark'])(
  'has no axe violations in the %s theme',
  async (theme) => {
    localStorage.setItem(themeStorageKey, theme);
    const { container } = render(<App />);

    expect(document.documentElement).toHaveAttribute('data-theme', theme);
    await expectNoAxeViolations(container);
  },
);
