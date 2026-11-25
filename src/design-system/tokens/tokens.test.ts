import { expect, test } from 'vitest';

import {
  cssCustomProperty,
  tokenFilePaths,
  tokenFileSource,
  tokenFiles,
  tokensCss,
} from '../../test/tokens';
import { collectTokens, resolveValue, type TokenMap } from './resolve';

function tokenPaths(contents: string): string[] {
  const tokens = new Map<string, unknown>();
  collectTokens(JSON.parse(contents) as unknown, [], tokens);
  return [...tokens.keys()].sort();
}

function tokensMatching(pattern: RegExp): TokenMap {
  const tokens: TokenMap = new Map();
  for (const path of tokenFilePaths(pattern)) {
    collectTokens(JSON.parse(tokenFiles[path]) as unknown, [], tokens);
  }
  return tokens;
}

function isColor(value: unknown): boolean {
  return typeof value === 'object' && value !== null && 'hex' in value;
}

test('component tokens resolve in light and dark, and colors are references', () => {
  const component = tokensMatching(/\/component\//);
  expect(component.size).toBeGreaterThan(0);

  for (const theme of ['light', 'dark']) {
    const tokens = tokensMatching(
      new RegExp(`/(primitive|component)/|/semantic/(common|${theme})\\.json$`),
    );
    for (const [name, value] of component) {
      // resolveValue throws on a dangling or circular reference.
      const resolved = resolveValue(name, tokens);
      if (isColor(resolved)) {
        expect(value, `${theme} ${name}`).toMatch(/^\{[^{}]+\}$/);
      }
    }
  }
});

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
  expect(tokensCss).toContain('--ds-color-bg-transparent: transparent');
});

test('button sizes are rem and the radius stays px', () => {
  for (const size of ['sm', 'md', 'lg']) {
    for (const part of [
      'min-height',
      'padding-block',
      'padding-inline',
      'gap',
      'font-size',
    ]) {
      expect(cssCustomProperty(`--ds-button-${size}-${part}`)).not.toBe('');
    }
  }
  expect(cssCustomProperty('--ds-button-sm-min-height')).toBe('2rem');
  expect(cssCustomProperty('--ds-button-md-min-height')).toBe('2.5rem');
  expect(cssCustomProperty('--ds-button-lg-min-height')).toBe('3rem');
  expect(cssCustomProperty('--ds-radius-sm')).toBe('4px');
});
