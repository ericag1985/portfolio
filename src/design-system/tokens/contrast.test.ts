import { expect, test } from 'vitest';

import {
  collectTokens,
  colorHex,
  contrastRatio,
  resolveValue,
  type TokenMap,
} from './resolve';

const tokenFiles = import.meta.glob('./**/*.json', {
  eager: true,
  import: 'default',
  query: '?raw',
});

const paths = Object.keys(tokenFiles).sort();

function filesMatching(pattern: RegExp): string[] {
  return paths.filter((path) => pattern.test(path));
}

function tokensFrom(filePaths: string[]): TokenMap {
  const tokens: TokenMap = new Map();
  for (const path of filePaths) {
    const source = tokenFiles[path];
    if (typeof source !== 'string') {
      throw new Error(`Token file ${path} did not load as text.`);
    }
    collectTokens(JSON.parse(source) as unknown, [], tokens);
  }
  return tokens;
}

const primitive = filesMatching(/\/primitive\//);
const common = filesMatching(/\/semantic\/common\.json$/);
const component = filesMatching(/\/component\//);
const light = tokensFrom([
  ...primitive,
  ...common,
  ...filesMatching(/\/semantic\/light\.json$/),
  ...component,
]);
const dark = tokensFrom([
  ...primitive,
  ...common,
  ...filesMatching(/\/semantic\/dark\.json$/),
  ...component,
]);

const textPairs = [
  ['text primary on canvas', 'color.text.primary', 'color.bg.canvas', 4.5],
  ['text primary on surface', 'color.text.primary', 'color.bg.surface', 4.5],
  ['text secondary on canvas', 'color.text.secondary', 'color.bg.canvas', 4.5],
  [
    'text secondary on surface',
    'color.text.secondary',
    'color.bg.surface',
    4.5,
  ],
  ['link on canvas', 'color.text.link', 'color.bg.canvas', 4.5],
  [
    'secondary button text on secondary background',
    'button.secondary.color',
    'button.secondary.background',
    4.5,
  ],
  [
    'on-accent on accent default',
    'color.text.on-accent',
    'color.accent.default',
    4.5,
  ],
  [
    'on-accent on accent hover',
    'color.text.on-accent',
    'color.accent.hover',
    4.5,
  ],
  [
    'on-accent on accent active',
    'color.text.on-accent',
    'color.accent.active',
    4.5,
  ],
  ['on-danger on danger', 'color.text.on-danger', 'color.danger.default', 4.5],
  [
    'inverse text on inverse background',
    'color.text.inverse',
    'color.bg.inverse',
    4.5,
  ],
] as const;

const nonTextPairs = [
  ['accent border on canvas', 'color.accent.default', 'color.bg.canvas', 3],
  ['focus on canvas', 'color.border.focus', 'color.bg.canvas', 3],
] as const;

function failuresFor(
  theme: string,
  tokens: TokenMap,
  pairs: ReadonlyArray<readonly [string, string, string, number]>,
): string[] {
  const failures: string[] = [];

  for (const [pair, foregroundToken, backgroundToken, minimum] of pairs) {
    let foreground: string;
    let background: string;
    try {
      foreground = colorHex(resolveValue(foregroundToken, tokens));
      background = colorHex(resolveValue(backgroundToken, tokens));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${theme} ${pair}: ${message}`);
      continue;
    }

    const ratio = contrastRatio(foreground, background);
    if (ratio < minimum) {
      failures.push(
        `${theme} ${pair}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1, below ${minimum}:1.`,
      );
    }
  }

  return failures;
}

test('text and UI contrast meet WCAG 2.x in light and dark', () => {
  const failures = [
    ...failuresFor('light', light, textPairs),
    ...failuresFor('light', light, nonTextPairs),
    ...failuresFor('dark', dark, textPairs),
    ...failuresFor('dark', dark, nonTextPairs),
  ];

  expect(failures, failures.join('\n')).toEqual([]);
});
