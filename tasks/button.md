# Task: Button

## Goal

Add an accessible Button with four variants, three sizes, and an icon-only
mode, so Tooltip's info pattern and later portfolio UI share one button.

Follow `AGENTS.md` and `.cursor/skills/component-authoring/SKILL.md`.

## Inputs

- `AGENTS.md`, `.cursor/skills/component-authoring/SKILL.md`
- `src/component-lab/components/Icon/` (icon names and sizes)
- `src/component-lab/components/Tooltip/` (naming, stories)
- `src/component-lab/tokens/component/button.json` (existing colors)

## API (`types.ts`)

```ts
export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonIcon =
  IconName | { name: IconName; placement: 'start' | 'end' };

export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  /** Always required. Visible text, or the tooltip and accessible name when icon-only. */
  label: string;
  /** Default `primary`. `link` looks like a link but stays a `<button>`. */
  variant?: ButtonVariant;
  /** Default `md`. */
  size?: ButtonSize;
  /** A bare `IconName` makes the button icon-only. The object form puts the icon beside the label. */
  icon?: ButtonIcon;
};
```

- `label` is always required. There are no children.
- No icon, or `{ name, placement }`: the label renders as text, and the icon
  sits at the start or end of it with `aria-hidden`.
- Bare `IconName`: the button is icon-only and square. It wraps itself in
  Tooltip with `naming="label"`, so the label is both the visible tooltip and
  the accessible name.
- `type` defaults to `"button"`. `disabled` uses the native attribute. The ref
  and other native props pass through.

Examples:

```tsx
<Button label="Save" />
<Button label="Add" icon={{ name: 'plus', placement: 'start' }} />
<Button label="More info" icon="info" />
```

## Files touched

- `src/component-lab/components/Button/`: `Button.tsx`, `types.ts`,
  `utils.ts` (only if needed), `index.ts`, `Button.module.css`,
  `Button.test.tsx`, `stories/Button.stories.tsx`
- `src/component-lab/tokens/component/button.json`, the generated
  `tokens.css`, and `tokens.test.ts`
- `src/component-lab/components/Tooltip/stories/` (the info example uses
  `<Button label="More info" icon="info" />`)

## Acceptance criteria

- [ ] Variants match the agreed palette: primary filled with the accent,
      secondary an accent outline on `bg.canvas`, destructive solid red, link
      in the link color.
- [ ] Sizes `sm`, `md`, `lg` have a minimum height of 32, 40, and 48 px
      (`2rem`, `2.5rem`, `3rem`). Icon-only buttons are square at the same
      sizes.
- [ ] Every size clears WCAG 2.5.8 AA (24×24). `lg` also clears 2.5.5 AAA
      (44×44).
- [ ] Padding, gap, and font size come from tokens and output as rem. Border
      width and radius stay px.
- [ ] Hover, active, focus-visible, and disabled states for every variant, all
      from tokens. The focus ring uses the existing focus-ring tokens.
- [ ] Forced colors: every variant keeps a visible boundary and focus ring.
- [ ] Text and icon colors pass 4.5:1 contrast in light and dark
      (`contrast.test.ts`).
- [ ] Icon start and end swap sides correctly in RTL.
- [ ] Icon-only: the label shows as a tooltip on hover and focus, and it is the
      button's accessible name.
- [ ] Tests (Testing Library): role and name for text, icon, and icon-only
      buttons; click; disabled blocks click; Enter and Space activate; the
      icon-only tooltip; default `type="button"`; ref passthrough.
- [ ] Stories: a sheet of every variant, size, and state in light and dark;
      icon start, end, and icon-only; RTL; the Tooltip info example.
- [ ] JSDoc on the component and anything non-obvious. No other comments.

## Out of scope

- Loading or spinner state, toggle or pressed state, button groups, full
  width.
- Rendering as `<a>` (a polymorphic `as` prop). Link-styled buttons stay
  `<button>`.
- An icon-only button with a separate description tooltip.
- Changes to Icon or to Tooltip behavior.

## Done

- [ ] `npm run lint`, `typecheck`, `test:unit`, `test:storybook`,
      `tokens:check`, `build`, and `build-storybook` pass.
- [ ] The PR description ticks each criterion and has a Verification section
      with light and dark story screenshots and a forced-colors screenshot.
