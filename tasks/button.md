# Task: Button

Build `Button`, the design system's action control. The about me and resume
pages use it next. Follow `AGENTS.md` and
`.cursor/skills/component-authoring/SKILL.md`. `Icon` is the reference
implementation. Where this spec and the skill disagree, the skill wins. Say
so in the PR.

## Goal

A native `<button>` with four token-driven variants, three sizes and optional
icons. It meets WCAG 2.2 AA in light and dark, in LTR and RTL, and in forced
colors.

## Inputs

- Pattern: `src/design-system/components/Icon/` (folder layout, `ref` as a
  prop in React 19, `types.ts` / `utils.ts` split, stories, tests).
- Icon API: `Icon`, `IconName`, `IconSize` from `../Icon`. Icons inside a
  button get no `label`, so Icon renders them decorative (`aria-hidden`).
- Tokens that already exist, in `src/design-system/tokens/component/button.json`:
  `--ds-button-{primary,secondary,destructive,link}-*`. Space
  (`--ds-space-*`), type (`--ds-font-size-*`), radius (`--ds-radius-*`),
  border (`--ds-border-width-*`), focus (`--ds-focus-ring-width`,
  `--ds-color-border-focus`) and motion (`--ds-motion-duration-*`).
- Do not depend on Tooltip (PR #4).

## API (`types.ts`)

```ts
export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonBaseProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'aria-label'
> & {
  variant?: ButtonVariant; // default 'primary'
  size?: ButtonSize; // default 'md'
  fullWidth?: boolean; // default false
};

/** Visible text is the accessible name. */
export type TextButtonProps = ButtonBaseProps & {
  children: ReactNode;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  icon?: never;
  'aria-label'?: string;
};

/** Icon only: `aria-label` is required by the type. */
export type IconButtonProps = ButtonBaseProps & {
  icon: IconName;
  'aria-label': string;
  children?: never;
  leadingIcon?: never;
  trailingIcon?: never;
};

export type ButtonProps = TextButtonProps | IconButtonProps;
```

- `type` defaults to `"button"`, not the browser's `"submit"`. Put the reason
  in JSDoc.
- Icon size follows button size (`sm`→`sm`, `md`→`md`, `lg`→`lg`). Keep that
  map in `utils.ts`, like Icon's `sizeToken`.
- An icon-only button whose `aria-label` is blank (after trimming) has no
  name, and the types can't catch that. `console.warn` when
  `import.meta.env.DEV`.
- Export `Button`, `buttonVariants`, `buttonSizes` and the types from
  `index.ts`.

## Tokens

Add to `button.json`, point every token at semantic tokens, run
`npm run tokens:build` and commit `tokens.css`:

- `primary.background-hover` → `color.accent.hover`, `primary.background-active`
  → `color.accent.active`
- `destructive.background-hover` → `color.danger.hover`,
  `destructive.background-active` → `color.danger.active`
- `secondary.background-hover` → `color.accent.subtle`
- disabled background, text and border. Point them at existing neutral
  semantic tokens (`color.bg.surface`, `color.text.secondary`,
  `color.border.default`). Disabled controls are exempt from contrast rules
  but must still read clearly as disabled in both themes.

Add pairs to `src/design-system/tokens/contrast.test.ts`, at 4.5:1 unless
noted:

- `button.destructive.color` on `button.destructive.background-hover` and
  `-active`
- `button.secondary.color` on `button.secondary.background-hover`
- `button.secondary.border-color` on `color.bg.canvas` (3:1, non-text)

## Styling (`Button.module.css`)

- Use only `--ds-*` tokens. No literal colors, sizes or durations. Rem values
  come from the space, type and icon tokens. Px comes from border, radius and
  focus tokens.
- Use logical properties only (`padding-inline`, `padding-block`,
  `margin-inline-*`). The icon order comes from DOM order, so RTL flips
  without extra CSS. Don't use `left` or `right`.
- Focus: `:focus-visible` with an outline using `--ds-focus-ring-width` and
  `--ds-color-border-focus`, plus a positive `outline-offset`. The ring then
  sits on the canvas, where the existing `focus on canvas` contrast test
  covers it.
- Hover and active styles go under `:not(:disabled)`. Transitions use
  `--ds-motion-duration-fast` (`normalize.css` already handles reduced
  motion).
- Every size, `sm` included, renders at least 24×24 CSS px (WCAG 2.5.8).
  Icon-only buttons are square.
- `link` variant: no padding box, underline text, still a `<button>`.
- `@media (forced-colors: active)`: keep a visible border on every variant
  except `link`, and keep the focus outline. Use system colors such as
  `ButtonText` and `Highlight`, not tokens.
- `fullWidth` sets `inline-size: 100%`.

## Files

```
src/design-system/components/Button/
  Button.tsx
  types.ts
  utils.ts
  index.ts
  Button.module.css
  Button.test.tsx
  stories/Button.stories.tsx
  stories/Button.stories.css
src/design-system/tokens/component/button.json   (new tokens)
src/design-system/tokens/tokens.css              (regenerated)
src/design-system/tokens/contrast.test.ts        (new pairs)
```

## Acceptance criteria

Unit tests (`Button.test.tsx`, Testing Library, helpers from `src/test/`):

- [ ] Renders `role="button"`, with the children as its accessible name.
- [ ] `type` is `"button"` by default, and `type="submit"` is passed through.
- [ ] `onClick` fires on click, Enter and Space, and not when `disabled`.
- [ ] Icon-only: the accessible name equals `aria-label`, and the svg is
      hidden from the accessibility tree.
- [ ] Text with icons: the accessible name is only the text.
- [ ] `ref` reaches the `<button>` element.
- [ ] Type tests: `icon` without `aria-label`, and `icon` with `children`, are
      both `@ts-expect-error`.

Stories (`Design System/Button`):

- [ ] One story per variant, plus disabled, leading icon, trailing icon,
      icon-only, full width and RTL (`dir="rtl"` wrapper).
- [ ] A sticker sheet with every variant × size × state, and
      `parameters.a11y.test: 'off'`.
- [ ] Args and controls cover every public prop. JSDoc fills autodocs.
- [ ] Every story works under the theme toolbar's light and dark.

Checks:

- [ ] `npm run lint`, `typecheck`, `test:unit`, `test:storybook`, `build`,
      `build-storybook` and `tokens:check` pass in CI.
- [ ] The PR description says: `sm` measured at least 24×24 px, and the focus
      ring stayed visible in forced colors and at 200% zoom.

## Out of scope

- Loading or busy state. Add it later if the contact form needs it.
- Rendering as a link (`href`). If the resume page needs a "Download résumé"
  link that looks like a button, that is a separate `ButtonLink` task.
- Toggle (`aria-pressed`) buttons and button groups.
