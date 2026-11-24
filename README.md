# portfolio

Personal site and design system for Erica Gugliemella.

The site is published at [ericag1985.github.io/portfolio](https://ericag1985.github.io/portfolio/). Storybook is published beside it at `/portfolio/storybook/`.

## Layout

- `src/site/` is the portfolio: About, resume, and the other pages.
- `src/design-system/tokens/` holds DTCG token JSON and the generated CSS custom properties. Light values go on `:root`. Dark values go on `[data-theme="dark"]`.
- `src/design-system/components/` holds one folder per component. `Component.tsx` is only the component, `types.ts` holds its types, `utils.ts` holds helpers and constants, `index.ts` is the public export, and stories live in `stories/`. `Icon` is the example: five Lucide icons (`plus`, `trash`, `settings`, `info`, `arrow-right`). Omit `label` when nearby text names it; pass `label` when the icon itself is the accessible name. The same rules are in `.cursor/skills/component-authoring/SKILL.md`.
- `src/design-system/foundations/` holds the color, type, and spacing sticker sheets.

Tooltip and Button components come in later changes. Button and tooltip tokens are already defined.

## Styling

Plain CSS only: `.css` files, and CSS Modules when a component needs them. No SCSS, Sass, Less, CSS-in-JS, or Tailwind, and no CSS preprocessor is installed.

`src/design-system/styles/normalize.css` is the shared baseline for the site and Storybook. It standardizes the box model, body margin, form fonts, and media. When `prefers-reduced-motion: reduce` matches, animation, transitions, and smooth scrolling are turned off.

## TypeScript

Components, stories, unit tests, and tool configs are TypeScript (`.ts` / `.tsx`). There is no `.js` or `.jsx` source. That includes `vite.config.ts`, `vitest.config.ts`, `eslint.config.ts`, and `.storybook/main.ts` / `preview.ts`.

## Scripts

| Script                    | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| `npm run tokens:build`    | Write `tokens.css` from the DTCG JSON            |
| `npm run tokens:check`    | Rebuild tokens and fail if the CSS is stale      |
| `npm run dev`             | Site dev server at `/portfolio/`                 |
| `npm run build`           | Typecheck and build the site into `dist/`        |
| `npm run typecheck`       | `tsc -b`                                         |
| `npm run lint`            | ESLint, including jsx-a11y, and Prettier         |
| `npm run storybook`       | Storybook dev server                             |
| `npm run build-storybook` | Static Storybook into `dist/storybook/`          |
| `npm run test:unit`       | Unit tests in jsdom with React Testing Library   |
| `npm run test:storybook`  | Storybook interaction and axe tests, in Chromium |
| `npm test`                | Both Vitest projects: `unit`, then `storybook`   |
| `npm run preview`         | Serve the built site                             |

`npm run test:storybook` and `npm test` need Chromium once per machine: `npx playwright install --with-deps chromium`. Unit tests do not.

Shared unit-test helpers live in `src/test/`.

Build the site before Storybook when producing the Pages artifact. `vite build` empties `dist/`, and `build-storybook` writes `dist/storybook` afterwards.

## Tokens

Design tokens live in `src/design-system/tokens/` as [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/) JSON, in three layers:

- **Primitive** (`primitive/`): color ramps, white, black, spacing, radius, type, border widths, the focus ring, motion, and icon sizes.
- **Semantic** (`semantic/light.json` and `semantic/dark.json`): theme aliases such as `color.bg.canvas` and `color.text.primary`. `semantic/common.json` holds values that do not change with the theme.
- **Component** (`component/`): button and tooltip tokens. These reference semantic tokens only.

`npm run tokens:build` runs Style Dictionary and writes `src/design-system/tokens/tokens.css`. Light tokens are custom properties on `:root` (`color-scheme: light`). Dark tokens are on `[data-theme="dark"]` (`color-scheme: dark`). The same dark values also apply under `prefers-color-scheme: dark` unless `data-theme="light"`. `prebuild`, `prestorybook`, and `prebuild-storybook` run the build so the CSS is regenerated before the site or Storybook starts. CI runs `npm run tokens:check` and fails if the committed CSS does not match the JSON.

To add a token, add `$type` and `$value` in the layer it belongs to. Point a semantic token at a primitive with `{color.gray.900}`. Point a component token at a semantic token, such as `{color.accent.default}`. Run `npm run tokens:build`.

The site follows the operating system until the header control stores `theme` in `localStorage`. That stored choice sets `data-theme` and overrides the system preference. Storybook's toolbar theme sets `data-theme` on the preview document and defaults to light. Foundations stories are sticker sheets and set `parameters.a11y.test` to `off`.

## Toolchain

Vite `base` is `/portfolio/`. The production Storybook build uses `/portfolio/storybook/` so its assets resolve on GitHub Pages.

TypeScript is pinned to 6.0.3. typescript-eslint 8.74 supports `>=4.8.4 <6.1.0`, and TypeScript 7.0 removes the compiler API that parser needs, so the current npm `latest` (7.0.2) cannot lint this repo. ESLint is 9.39.5 because `eslint-plugin-jsx-a11y` 6.10.2 does not yet declare support for ESLint 10.

Accessibility violations fail `npm run test:storybook`. `.storybook/preview.ts` sets `parameters.a11y.test` to `error`, and the Vitest addon runs axe with the interaction tests. Sticker sheet stories opt out with `parameters.a11y.test: 'off'` on that story. Playground stories and test stories leave the default in place, so axe violations still fail those runs. Pull request CI runs `test:unit` and `test:storybook` separately.

## GitHub Pages

Deploys run from `.github/workflows/pages.yml` on pushes to `main`. Before the first deploy, set **Settings → Pages → Source** to **GitHub Actions**.
