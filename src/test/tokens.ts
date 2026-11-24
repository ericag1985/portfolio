import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const testDir = dirname(fileURLToPath(import.meta.url));

export const tokensCss = readFileSync(
  resolve(testDir, '../design-system/tokens/tokens.css'),
  'utf8',
);

const style = document.createElement('style');
style.textContent = tokensCss;
document.head.append(style);

const rawTokenFiles = import.meta.glob('../design-system/tokens/**/*.json', {
  eager: true,
  import: 'default',
  query: '?raw',
});

export const tokenFiles: Record<string, string> = {};

for (const [path, contents] of Object.entries(rawTokenFiles)) {
  if (typeof contents !== 'string') {
    throw new Error(`${path} did not load as text.`);
  }
  tokenFiles[path] = contents;
}

export function tokenFilePaths(pattern: RegExp): string[] {
  return Object.keys(tokenFiles)
    .filter((path) => pattern.test(path))
    .sort();
}

export function tokenFileSource(pattern: RegExp): string {
  const path = tokenFilePaths(pattern)[0];
  if (!path) {
    throw new Error(`No token file matched ${pattern}.`);
  }
  return tokenFiles[path];
}

export function cssCustomProperty(
  name: string,
  element: Element = document.documentElement,
): string {
  return getComputedStyle(element).getPropertyValue(name).trim();
}
