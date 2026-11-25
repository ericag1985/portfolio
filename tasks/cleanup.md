# Task: Cleanup before Button

This portfolio is interview material. Every file should be the simplest
correct version a reviewer could read in one pass. This task fixes the
findings from Claude's review of `main`, including a smaller rewrite of
Tooltip. Do it before Button, so Button starts from the cleaned-up patterns.

Follow `AGENTS.md` and `.cursor/skills/component-authoring/SKILL.md`. Do the
work in the order listed. One PR from this branch.

## 1. Tooltip rewrite (smaller, same accessibility)

### Goal

Keep WCAG 2.2 AA (1.4.13 hoverable, persistent, dismissible, plus 1.4.10
reflow) with far less code. Hover, focus and delays move to CSS. JavaScript
tracks three things: hover, focus within, and Escape dismissal. It also keeps
the bubble inside the viewport.

### Decisions (already made, don't revisit)

- **A child trigger is required.** Remove the built-in info-icon button.
  Once Button exists, the info pattern is
  `<Tooltip content="…" naming="label"><Button icon="info" /></Tooltip>`.
- **Tooltip text is supplementary only.** Put this rule in JSDoc: never put
  information in a tooltip that isn't available some other way. That's why
  there's no tap-to-pin touch mode. Browsers that focus a button on tap
  (Android) show it through focus. iOS doesn't, which is acceptable for
  supplementary text.
- **Placements are `top` and `bottom` only.** `start` and `end` are removed,
  because they can't stay inside a narrow viewport.
- **Escape never calls `stopPropagation()`.**

### API (`types.ts`)

```ts
export type TooltipPlacement = 'top' | 'bottom';
export type TooltipNaming = 'description' | 'label';

export type TooltipProps = {
  /** Supplementary text. See the component JSDoc for the rule. */
  content: string;
  /** `description` → aria-describedby (default). `label` → aria-labelledby. */
  naming?: TooltipNaming;
  /** Default `top`. */
  placement?: TooltipPlacement;
  /** One focusable element. It receives the aria relationship. */
  children: ReactElement<TriggerProps>;
};
```

Keep `applyTriggerProps` and `joinIds` (they append to an existing aria list
instead of replacing it). Delete everything else in `utils.ts` that the new
design doesn't use: timers, `readDuration`, `TooltipActivity`,
`resolveTriggerLabel`, `defaultTriggerAria`, `touchTapWindowMs`.

### Behavior

- **State (`useTooltip.ts`):** `hovered` (`pointerenter` and `pointerleave`
  on the root), `focused` (focus is inside the root), and `dismissed`. The
  root renders `data-state="open" | "closed" | "dismissed"`, where open means
  (`hovered` or `focused`) and not `dismissed`. Hover is tracked in JS, not
  with CSS `:hover`, because test tools fire synthetic pointer events that
  never set `:hover`, so a CSS-only version can't be tested.
- **Show and delay (CSS, no timers):** the bubble is `visibility: hidden` by
  default, with `transition: visibility 0s linear var(--ds-tooltip-delay-close)`.
  `[data-state='open']` sets `visibility: visible` with
  `transition-delay: var(--ds-tooltip-delay-open)`. `[data-state='dismissed']`
  sets `transition-delay: 0s`, so Escape hides it at once. Any focus shows it,
  mouse focus included, the same as before.
- **Hoverable:** the bubble is a DOM child of `.root`, and a transparent
  `::before` bridge covers the offset, so moving onto the bubble never fires
  `pointerleave`.
- **Escape:** while open or hovered or focused, a `keydown` listener on
  `document` sets `dismissed` on Escape. Don't call `stopPropagation()`, and
  don't move focus. Clear `dismissed` when the root is neither hovered nor
  focused.
- **Viewport (1.4.10):**
  - CSS: `max-width: min(var(--ds-tooltip-max-width), calc(100vw - 2 * var(--ds-space-4)))`.
  - JS: on `pointerenter` and `focusin`, measure the bubble. A hidden
    element is still laid out, so measuring works before it shows. Set a
    local custom property `--tooltip-nudge` (px) on the root so the bubble
    stays at least `--ds-space-4` from both viewport edges. The bubble
    translates by the nudge, and the caret counter-translates so it keeps
    pointing at the trigger.
  - Put the math in a pure `viewportNudge(rect, viewportWidth, margin)` in
    `utils.ts`, and measure from the un-nudged position.
  - The margin constant gets a JSDoc line tying it to `--ds-space-4`. A unit
    test asserts that `--ds-space-4` is `1rem`, so the two can't drift.
- **Centering:** keep the physical `left: 50%` + `translateX(-50%)`
  (correct in RTL), now plus the nudge.
- **Forced colors:** keep the transparent border, and hide the caret.
- **Caret:** make it one `::after` rule driven by `data-placement`, not one
  block per placement.

### Size budget (a guideline, not a hard limit)

`useTooltip.ts` about 50 lines, `Tooltip.tsx` about 40, `Tooltip.module.css`
about 90. If you go well over, say why in the PR.

### Tokens

- `tooltip.caret-size` → `{space.2}`. Then delete the
  `tooltip.caret-size` special case from `usesRem()` in `build.ts`, and
  revert the caret wording in `build.ts` JSDoc and in the skill's CSS
  section.
- Keep `delay-open` and `delay-close` (CSS uses them now).

### Tests

Unit (`Tooltip.test.tsx`, jsdom). Replace the current file, and assert what
a person gets:

- [ ] `naming` default: the trigger's accessible description is `content`.
      With `naming="label"`, its accessible name is `content`.
- [ ] An existing `aria-describedby` / `aria-labelledby` on the child is kept,
      and the tooltip id is appended once. The child's own `onClick` still
      fires.
- [ ] The tooltip has `role="tooltip"` and a stable id.
- [ ] Hover and unhover, and focus and blur, switch `data-state` between
      `open` and `closed`.
- [ ] Escape while focused sets `data-state="dismissed"`, focus stays put,
      and a `keydown` listener on the trigger still receives the Escape.
      Tabbing away and back opens it again.
- [ ] `viewportNudge`: inside the viewport → 0, past the left edge →
      positive, past the right edge → negative, wider than the viewport →
      aligns to the left margin.
- [ ] `@ts-expect-error` checks: no children, and `placement="start"`.

Browser (Storybook `play`, real Chromium). Real CSS, delays and layout only
apply here:

- [ ] Hover shows the bubble after the open delay. Moving onto the bubble
      keeps it open. Leaving hides it.
- [ ] Keyboard focus shows it.
- [ ] Escape while hovered hides it, and it stays hidden until the pointer
      leaves and comes back.
- [ ] `EdgeOfViewport` story: a trigger flush against the left edge and one
      against the right edge. The bubble's rect is fully inside the
      viewport, and the caret's center is within 1px of the trigger's
      center.
- [ ] `RightToLeft` story: top and bottom are centered on the trigger.

Stories: Playground, Top, Bottom, LabelNaming, EdgeOfViewport, RightToLeft,
and a sticker sheet (`a11y.test: 'off'`). Delete the rest.

## 2. Token tests

`src/component-lab/tokens/tokens.test.ts`: delete the per-token
`toContain('--ds-…')` assertions for button and tooltip, because
`tokens:check` already guards the generated CSS. Replace them with one test:
every token in `tokens/component/*.json` resolves (no dangling reference) in
light and dark, using `collectTokens` and `resolveValue` from `resolve.ts`.
Every `color` token there must be a reference, not a literal. Keep the other
existing tests.

## 3. Dead code

Delete `src/component-lab/components/Placeholder.tsx` and
`Placeholder.stories.tsx`.

## 4. Theme persistence bug

`src/site/theme.ts`: wrap the `localStorage.setItem` in `persistTheme` in
`try/catch`, matching `storedTheme`. Without it, the toggle throws when
storage is blocked. Add a test to `App.test.tsx`: when `setItem` throws, the
toggle still switches the theme.

## 5. Docs

- `README.md`: update the Tooltip sentence (child trigger required,
  supplementary text only), and remove Placeholder if it's mentioned.
- `.cursor/skills/component-authoring/SKILL.md`: revert the caret wording
  (see Tokens), then trim it to only what's needed to build any component:
  - [ ] Drop the Storybook glob note, the rem/px generator rules (they live
        in `build.ts`), and the Comments section (it duplicates `AGENTS.md`).
  - [ ] Mark `useComponent.ts` as only for stateful components, and make the
        extra-module rule generic instead of naming `icons.ts`.
  - [ ] State: the hook holds what CSS can't see and exposes it as
        `data-state`. Delays and transitions are CSS, not timers.
  - [ ] Tests: when CSS decides visibility, unit tests assert `data-state`,
        and Storybook `play` asserts real visibility, delays and layout.
  - [ ] Stories that measure layout wrap the component in its own cell.

## Files touched

```
src/component-lab/components/Tooltip/*            (rewrite; same folder layout)
src/component-lab/components/Tooltip/stories/*
src/component-lab/components/Placeholder.tsx      (delete)
src/component-lab/components/Placeholder.stories.tsx (delete)
src/component-lab/tokens/component/tooltip.json
src/component-lab/tokens/build.ts
src/component-lab/tokens/tokens.css               (regenerated)
src/component-lab/tokens/tokens.test.ts
src/site/theme.ts
src/site/App.test.tsx
README.md
.cursor/skills/component-authoring/SKILL.md
```

## Done

- [ ] `npm run lint`, `typecheck`, `test:unit`, `test:storybook`, `build`,
      `build-storybook` and `tokens:check` pass in CI.
- [ ] The PR description lists each section above with a one-line result,
      plus line counts before and after for the three Tooltip files.

## Out of scope

- Icon. It stays as is.
- Button. Its spec gets updated after this merges.
- Collision flipping (top ↔ bottom). Only horizontal nudging is in scope.
