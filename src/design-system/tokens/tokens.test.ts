import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test } from 'vitest';

import { collectTokens } from './resolve';

const tokensCss = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), 'tokens.css'),
  'utf8',
);

const tokenFiles = import.meta.glob('./**/*.json', {
  eager: true,
  import: 'default',
  query: '?raw',
});

function source(pattern: RegExp): string {
  const path = Object.keys(tokenFiles).find((file) => pattern.test(file));
  if (!path) {
    throw new Error(`No token file matched ${pattern}.`);
  }
  const contents = tokenFiles[path];
  if (typeof contents !== 'string') {
    throw new Error(`${path} did not load as text.`);
  }
  return contents;
}

function tokenPaths(contents: string): string[] {
  const tokens = new Map<string, unknown>();
  collectTokens(JSON.parse(contents) as unknown, [], tokens);
  return [...tokens.keys()].sort();
}

test('light and dark semantic themes define the same tokens', () => {
  expect(tokenPaths(source(/\/semantic\/light\.json$/))).toEqual(
    tokenPaths(source(/\/semantic\/dark\.json$/)),
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
  expect(tokensCss).toContain('--ds-color-bg-transparent: transparent');
});
