# portfolio

Personal site and design system for Erica Gugliemella.

The site is published at [ericag1985.github.io/portfolio](https://ericag1985.github.io/portfolio/). Storybook is published beside it at `/portfolio/storybook/`.

## Layout

- `src/site/` is the portfolio: About, resume, and the other pages.
- `src/design-system/tokens/` will hold design tokens as CSS custom properties. Light values go on `:root`. Dark values go on `[data-theme="dark"]`.
- `src/design-system/components/` holds design system components. Stories live next to the component they document.

Tokens, Icon, Tooltip, and Button come in later changes. This scaffold ships a placeholder page, one placeholder story, and one unit test so CI can typecheck, lint, build, and run both test suites.

## Styling

Plain CSS only: `.css` files, and CSS Modules when a component needs them. No SCSS, Sass, Less, CSS-in-JS, or Tailwind, and no CSS preprocessor is installed.

`src/design-system/styles/normalize.css` is the shared baseline for the site and Storybook. It standardizes the box model, body margin, form fonts, and media. When `prefers-reduced-motion: reduce` matches, animation, transitions, and smooth scrolling are turned off.

## TypeScript

Components, stories, unit tests, and tool configs are TypeScript (`.ts` / `.tsx`). There is no `.js` or `.jsx` source. That includes `vite.config.ts`, `vitest.config.ts`, `eslint.config.ts`, and `.storybook/main.ts` / `preview.ts`.

## Scripts

| Script                    | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
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

Build the site before Storybook when producing the Pages artifact. `vite build` empties `dist/`, and `build-storybook` writes `dist/storybook` afterwards.

## Toolchain

Vite `base` is `/portfolio/`. The production Storybook build uses `/portfolio/storybook/` so its assets resolve on GitHub Pages.

TypeScript is pinned to 6.0.3. typescript-eslint 8.74 supports `>=4.8.4 <6.1.0`, and TypeScript 7.0 removes the compiler API that parser needs, so the current npm `latest` (7.0.2) cannot lint this repo. ESLint is 9.39.5 because `eslint-plugin-jsx-a11y` 6.10.2 does not yet declare support for ESLint 10.

Accessibility violations fail `npm run test:storybook`. `.storybook/preview.ts` sets `parameters.a11y.test` to `error`, and the Vitest addon runs axe with the interaction tests. Stories tagged `stickersheet` are skipped, because a sheet of many components fails axe for reasons that are not useful signal. Playground stories and other stories keep the default `test` tag, so their interaction and axe checks still fail the run. Pull request CI runs `test:unit` and `test:storybook` separately.

## GitHub Pages

Deploys run from `.github/workflows/pages.yml` on pushes to `main`. Before the first deploy, set **Settings → Pages → Source** to **GitHub Actions**.
