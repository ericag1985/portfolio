import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { format, resolveConfig } from 'prettier';
import StyleDictionary from 'style-dictionary';
import {
  logVerbosityLevels,
  logWarningLevels,
  transforms,
  transformTypes,
} from 'style-dictionary/enums';
import type { Config, TransformedToken } from 'style-dictionary/types';

const tokensDir = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(tokensDir, 'tokens.css');

type StructuredValue = {
  value: number;
  unit: string;
};

type ColorValue = {
  alpha?: number;
  hex?: string;
};

function isStructured(value: unknown): value is StructuredValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'unit' in value &&
    typeof value.value === 'number' &&
    typeof value.unit === 'string'
  );
}

function isColorValue(value: unknown): value is ColorValue {
  return typeof value === 'object' && value !== null && 'hex' in value;
}

const hooks: Config['hooks'] = {
  transforms: {
    'size/css': {
      type: transformTypes.value,
      filter: (token: TransformedToken) => token.$type === 'dimension',
      transform: (token: TransformedToken) => {
        const value: unknown = token.$value;
        return isStructured(value) ? `${value.value}${value.unit}` : value;
      },
    },
    'duration/css': {
      type: transformTypes.value,
      filter: (token: TransformedToken) => token.$type === 'duration',
      transform: (token: TransformedToken) => {
        const value: unknown = token.$value;
        return isStructured(value) ? `${value.value}${value.unit}` : value;
      },
    },
    'color/css-exact': {
      type: transformTypes.value,
      filter: (token: TransformedToken) => token.$type === 'color',
      transform: (token: TransformedToken) => {
        const value: unknown = token.$value;
        if (!isColorValue(value)) {
          return value;
        }
        if (value.alpha === 0) {
          return 'transparent';
        }
        return value.hex;
      },
    },
  },
};

const cssTransforms = [
  transforms.nameKebab,
  'size/css',
  'duration/css',
  'color/css-exact',
  transforms.fontFamilyCss,
];

function dictionary(
  source: string[],
  filter?: (token: TransformedToken) => boolean,
) {
  const config = {
    source,
    usesDtcg: true,
    log: {
      verbosity: logVerbosityLevels.silent,
      warnings: logWarningLevels.disabled,
    },
    hooks,
    platforms: {
      css: {
        prefix: 'ds',
        transforms: cssTransforms,
        files: [
          {
            destination: 'tokens.css',
            format: 'css/variables',
            filter,
            options: {
              selector: ':root',
              outputReferences: true,
              showFileHeader: false,
            },
          },
        ],
      },
    },
  } satisfies Config;

  return new StyleDictionary(config);
}

function declarations(css: string): string {
  const start = css.indexOf('{');
  const end = css.lastIndexOf('}');
  if (start < 0 || end <= start) {
    throw new Error('Style Dictionary returned CSS without a rule block.');
  }
  return css.slice(start + 1, end).trim();
}

function rule(
  selector: string,
  scheme: 'light' | 'dark',
  body: string,
): string {
  return `${selector} {\n  color-scheme: ${scheme};\n  ${body}\n}`;
}

async function cssFor(
  source: string[],
  filter?: (token: TransformedToken) => boolean,
): Promise<string> {
  const formatted = await dictionary(source, filter).formatPlatform('css');
  const output = formatted[0]?.output;
  if (typeof output !== 'string') {
    throw new Error('Style Dictionary did not return CSS.');
  }
  return declarations(output);
}

const primitive = resolve(tokensDir, 'primitive/**/*.json');
const common = resolve(tokensDir, 'semantic/common.json');
const components = resolve(tokensDir, 'component/**/*.json');

const lightBody = await cssFor([
  primitive,
  common,
  resolve(tokensDir, 'semantic/light.json'),
  components,
]);

const darkBody = await cssFor(
  [primitive, resolve(tokensDir, 'semantic/dark.json')],
  (token) => token.filePath.endsWith('semantic/dark.json'),
);

const darkRule = rule('[data-theme="dark"]', 'dark', darkBody);

// An explicit light theme has to keep data-theme="light" so this query does not override it.
const systemDark = `@media (prefers-color-scheme: dark) {\n${rule(
  ':root:not([data-theme="light"])',
  'dark',
  darkBody,
)}\n}`;

const source = `${rule(':root', 'light', lightBody)}\n\n${darkRule}\n\n${systemDark}\n`;
const prettierConfig = await resolveConfig(outputPath);
const formatted = await format(source, {
  ...prettierConfig,
  filepath: outputPath,
});
writeFileSync(outputPath, formatted);
