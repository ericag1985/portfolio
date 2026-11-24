import { expect, test } from 'vitest';

import { tokenFileSource, tokenFiles, tokensCss } from '../../test/tokens';
import { collectTokens } from './resolve';

function tokenPaths(contents: string): string[] {
  const tokens = new Map<string, unknown>();
  collectTokens(JSON.parse(contents) as unknown, [], tokens);
  return [...tokens.keys()].sort();
}

test('light and dark semantic themes define the same tokens', () => {
  expect(tokenPaths(tokenFileSource(/\/semantic\/light\.json$/))).toEqual(
    tokenPaths(tokenFileSource(/\/semantic\/dark\.json$/)),
  );
});

test('component tokens reference semantic tokens only', () => {
  const componentSources = Object.entries(tokenFiles).filter(([path]) =>
    path.includes('/component/'),
  );

  expect(componentSources.length).toBeGreaterThan(0);

  for (const [path, contents] of componentSources) {
    expect(typeof contents, path).toBe('string');
    expect(contents, path).not.toMatch(
      /\{color\.(white|black|gray|eggplant|red)(?:\.|\})/,
    );
    expect(contents, path).toMatch(/\{color\.(bg|text|border|accent|danger)\./);
  }
});

test('generated CSS publishes light, dark, and system-dark token sets', () => {
  expect(tokensCss).toContain('color-scheme: light');
  expect(tokensCss).toContain("[data-theme='dark']");
  expect(tokensCss).toContain('color-scheme: dark');
  expect(tokensCss).toContain('prefers-color-scheme: dark');
  expect(tokensCss).toContain(":root:not([data-theme='light'])");
  expect(tokensCss).toContain('--ds-color-white: #ffffff');
  expect(tokensCss).toContain('--ds-color-black: #000000');
  expect(tokensCss).toContain('--ds-color-eggplant-600: #7f3b93');
  expect(tokensCss).toContain('--ds-color-gray-950: #0f0f0f');
  expect(tokensCss).toContain('--ds-color-red-600: #ac1b23');
  expect(tokensCss).toContain('--ds-color-bg-canvas: var(--ds-color-white)');
  expect(tokensCss).toContain('--ds-color-bg-canvas: var(--ds-color-gray-950)');
  expect(tokensCss).toContain(
    '--ds-color-text-link: var(--ds-color-accent-default)',
  );
  expect(tokensCss).toContain(
    '--ds-button-primary-background: var(--ds-color-accent-default)',
  );
  expect(tokensCss).toContain(
    '--ds-button-primary-color: var(--ds-color-text-on-accent)',
  );
  expect(tokensCss).toContain(
    '--ds-button-secondary-background: var(--ds-color-bg-canvas)',
  );
  expect(tokensCss).toContain(
    '--ds-button-secondary-border-color: var(--ds-color-accent-default)',
  );
  expect(tokensCss).toContain(
    '--ds-button-secondary-color: var(--ds-color-accent-default)',
  );
  expect(tokensCss).toContain(
    '--ds-button-destructive-background: var(--ds-color-danger-default)',
  );
  expect(tokensCss).toContain(
    '--ds-button-destructive-color: var(--ds-color-text-on-danger)',
  );
  expect(tokensCss).toContain(
    '--ds-button-link-color: var(--ds-color-text-link)',
  );
  expect(tokensCss).toContain(
    '--ds-tooltip-background: var(--ds-color-bg-inverse)',
  );
  expect(tokensCss).toContain(
    '--ds-tooltip-color: var(--ds-color-text-inverse)',
  );
  expect(tokensCss).toContain('--ds-tooltip-padding-block: var(--ds-space-1)');
  expect(tokensCss).toContain('--ds-tooltip-padding-inline: var(--ds-space-2)');
  expect(tokensCss).toContain('--ds-tooltip-offset: var(--ds-space-2)');
  expect(tokensCss).toContain('--ds-tooltip-radius: var(--ds-radius-sm)');
  expect(tokensCss).toContain('--ds-tooltip-font-size: var(--ds-font-size-14)');
  expect(tokensCss).toContain(
    '--ds-tooltip-line-height: var(--ds-font-line-height-14)',
  );
  expect(tokensCss).toContain('--ds-tooltip-max-width: 16rem');
  expect(tokensCss).toContain(
    '--ds-tooltip-delay-open: var(--ds-motion-duration-base)',
  );
  expect(tokensCss).toContain(
    '--ds-tooltip-delay-close: var(--ds-motion-duration-fast)',
  );
  expect(tokensCss).toContain('--ds-color-bg-transparent: transparent');
});
