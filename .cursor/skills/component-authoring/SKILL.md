---
name: component-authoring
description: Use when creating or changing any design-system component or its stories. Follow the Icon folder layout, token styling, accessibility, stories, and tests.
---

# Component authoring

`src/design-system/components/Icon/` is the pattern for every component.

## Folder

```
Component/
  Component.tsx
  types.ts
  utils.ts
  index.ts
  Component.module.css
  Component.test.tsx
  stories/Component.stories.tsx
  stories/Component.stories.css
```

`Component.tsx` is only the component. Prop unions and other types live in
`types.ts`. Constants and helpers live in `utils.ts`. `index.ts` is the
public barrel; files outside the folder import from there. A component
that needs another module, such as Icon's `icons.ts` registry, keeps it
beside those files and does not export it unless it is public API.

Storybook loads `src/**/*.stories.tsx`, which already includes `stories/`.

## CSS and tokens

Plain CSS or CSS Modules only. Use `--ds-*` tokens for color, size,
space, type, and motion. Light and dark come from those tokens. Add
component tokens under `src/design-system/tokens/component/*.json`,
point them at semantic tokens, run `npm run tokens:build`, and commit
`tokens.css`.

## TypeScript

Variant and name props are unions (`'sm' | 'md' | 'lg'`), not loose
strings. Export the unions from `types.ts`.

## Accessibility

Use a semantic element. Give a control visible text or an accessible
name. Show `:focus-visible`. `prefers-reduced-motion` is already handled
by `normalize.css`. Storybook axe must pass. Sticker sheets set
`parameters.a11y.test` to `'off'`. Playground and test stories leave the
default `error`.

## Stories

TypeScript CSF3. Title path such as `Design System/Icon`. One story per
variant or state, plus a sticker sheet. Args and controls cover the
public props. The theme toolbar sets `data-theme`, so each story has to
work in light and dark.

## Tests

React Testing Library. Assert what a person can see or hear (role, name,
text), not private structure. Shared helpers live in `src/test/`.
`src/test/setup.ts` installs the token CSS for every unit test. Import
those helpers. Do not copy them into a component test.

## Done

`npm run lint`, `npm run typecheck`, `npm run test:unit`,
`npm run test:storybook`, `npm run build`, and `npm run build-storybook`
pass. When tokens change, `npm run tokens:check` passes too.
