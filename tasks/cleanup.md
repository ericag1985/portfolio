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
does only three things: wire up ARIA, dismiss on Escape, and keep the bubble
inside the viewport.

### Decisions (already made, don't revisit)

- **A child trigger is required.** Remove the built-in info-icon button.
  Once Button exists, the info pattern is
  `<Tooltip content="…" naming="label"><Button icon="info" /></Tooltip>`.
- **Tooltip text is supplementary only.** Put this rule in JSDoc: never put
  information in a tooltip that isn't available some other way. That's why
  there's no tap-to-pin touch mode. Mobile browsers apply `:hover` on tap,
  which is enough for supplementary text.
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

- **Show (CSS):** the bubble is `visibility: hidden` by default. It becomes
  visible when `.root:hover` or `.root:has(:focus-visible)`. Use
  `transition: visibility 0s linear var(--ds-tooltip-delay-close)` while
  hidden, and `transition-delay: var(--ds-tooltip-delay-open)` while shown.
  That gives the open delay and a short close grace period with no timers.
- **Hoverable:** the bubble is a DOM child of `.root`, and a transparent
  `::before` bridge covers the offset, so moving the pointer onto the bubble
  keeps `:hover`.
- **Escape (`useTooltip.ts`):** one `keydown` listener on `document`. On
  Escape, if the root is hovered (`matches(':hover')`) or contains
  `document.activeElement`, set `dismissed`. That renders
  `data-dismissed` on the root, and CSS hides the bubble with no delay.
  Clear `dismissed` on `pointerleave` and `focusout` once the root is neither
  hovered nor focused. Don't move focus.
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
- [ ] Escape while the trigger is focused sets `data-dismissed`, focus stays
      put, and a `keydown` listener on the trigger still receives the
      Escape. Tabbing away and back clears it.
- [ ] `viewportNudge`: inside the viewport → 0, past the left edge →
      positive, past the right edge → negative, wider than the viewport →
      aligns to the left margin.
- [ ] `@ts-expect-error` checks: no children, and `placement="start"`.

Browser (Storybook `play`, real Chromium). Hover and `:focus-visible` only
work here:

- [ ] Hover shows the bubble after the open delay. Moving onto the bubble
      keeps it open. Leaving hides it.
- [ ] Keyboard focus shows it. Mouse click focus without hover doesn't keep
      it open after the pointer leaves.
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

`src/design-system/tokens/tokens.test.ts`: delete the per-token
`toContain('--ds-…')` assertions for button and tooltip, because
`tokens:check` already guards the generated CSS. Replace them with one test:
every token in `tokens/component/*.json` resolves (no dangling reference) in
light and dark, using `collectTokens` and `resolveValue` from `resolve.ts`.
Every `color` token there must be a reference, not a literal. Keep the other
existing tests.

## 3. Dead code

Delete `src/design-system/components/Placeholder.tsx` and
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
  (see Tokens).

## Files touched

```
src/design-system/components/Tooltip/*            (rewrite; same folder layout)
src/design-system/components/Tooltip/stories/*
src/design-system/components/Placeholder.tsx      (delete)
src/design-system/components/Placeholder.stories.tsx (delete)
src/design-system/tokens/component/tooltip.json
src/design-system/tokens/build.ts
src/design-system/tokens/tokens.css               (regenerated)
src/design-system/tokens/tokens.test.ts
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
