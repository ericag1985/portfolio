---
name: component-authoring
description: Use when creating or changing any design-system component or its stories. Covers folder layout, styling with tokens, accessibility, stories, and tests.
---

# Component authoring

`src/design-system/components/Icon/` is the reference component.

## Folder

```
Component/
  Component.tsx
  useComponent.ts        (only when stateful)
  types.ts
  utils.ts
  index.ts
  Component.module.css
  Component.test.tsx
  stories/Component.stories.tsx
  stories/Component.stories.css
```

- `Component.tsx` is only the render.
- `useComponent.ts` holds state that CSS can't see (hover, focus within,
  dismissal) and exposes it as a `data-state` attribute. Delays and
  transitions belong in CSS, not timers. Don't export the hook unless it's
  public API.
- `types.ts` holds prop types. `utils.ts` holds constants and helpers.
- `index.ts` is the public barrel, and code outside the folder imports from
  it. Other modules stay in the folder and aren't exported unless they're
  public API.

## CSS and tokens

Plain CSS or CSS Modules. Use `--ds-*` tokens for color, size, space, type,
and motion, so light and dark work automatically. Component tokens go in
`src/design-system/tokens/component/*.json` and reference semantic tokens.
Run `npm run tokens:build` and commit `tokens.css`.

## TypeScript

Variant and name props are unions (`'sm' | 'md' | 'lg'`), exported from
`types.ts`.

## Accessibility

- Every component must meet WCAG 2.2 AA. This is a must, not a
  nice-to-have. Stories don't have to: a sticker sheet that crowds every
  state together is fine.
- Use a semantic element, and give every control visible text or an
  accessible name.
- Style `:focus-visible`.
- `normalize.css` already handles `prefers-reduced-motion`.
- Storybook axe must pass. Sticker sheets set `parameters.a11y.test` to
  `'off'`, and all other stories keep the default `error`.

## Stories

- TypeScript CSF3, titled `Design System/<Component>`.
- One story per variant or state, plus a sticker sheet.
- Args and controls cover the public props.
- Every story works in light and dark (the toolbar sets `data-theme`).
- A story that measures layout wraps the component in its own cell, so a
  grid or flex parent doesn't stretch it.

## Tests

- Use React Testing Library, and assert what a person gets (role, name,
  description, text), not private structure.
- jsdom doesn't apply CSS. When CSS decides visibility, unit tests assert
  the `data-state` it reads, and Storybook `play` asserts real visibility,
  delays, and layout.
- Use the helpers in `src/test/` (`setup.ts` loads token CSS). Don't copy
  them into a component test.

## Done

`npm run lint`, `typecheck`, `test:unit`, `test:storybook`, `build`, and
`build-storybook` pass, plus `tokens:check` when tokens change.
