# Task: Tooltip review fixes (PR #4)

Push these to the existing branch, `cursor/tooltip-component-a04d`. Don't open
a new PR. The background is in the inline comments of the Claude review on
PR #4. Follow `AGENTS.md` and `.cursor/skills/component-authoring/SKILL.md`.
Keep behavior in `useTooltip.ts` and keep the render in `Tooltip.tsx`.

Only touch the files listed below. Everything else in the PR is approved
as-is, including the RTL centering.

## 1. Escape during the open delay must not be swallowed

`useTooltip.ts`: while the tooltip is only _opening_ (timer pending, nothing
shown), Escape still cancels the timer and sets `suppressed`, but does **not**
call `stopPropagation()`. Call `stopPropagation()` only when the bubble was
actually visible (`openRef.current` was `true`).

Tests (`Tooltip.test.tsx`):

- [ ] Hover the trigger, then press Escape before the open delay passes. A
      `keydown` listener on another focused element (e.g. a text input)
      receives the Escape, and no tooltip appears after the delay.
- [ ] Existing test still passes: Escape on a _visible_ hover-opened tooltip
      closes it.

## 2. Forced colors (Windows high contrast)

`Tooltip.module.css`:

- `.tooltip` gets `border: var(--ds-border-width-thin) solid transparent;` so
  forced colors paints a visible outline. Nothing visible changes otherwise.
  `box-sizing` is already `border-box`.
- Under `@media (forced-colors: active)`, hide `.tooltip::after` (the caret).
  The bordered bubble is enough, and a caret drawn from border colors isn't
  reliable in that mode. Keep `::before` (the hover bridge). It has no paint.

Checks:

- [ ] PR comment with a screenshot of the sticker sheet in Chromium with
      forced colors emulated (DevTools → Rendering → "Emulate CSS
      forced-colors: active"): the bubble has a visible border and there are
      no stray boxes where the caret was.

## 3. Touch: default trigger must open on tap

**Check this first.** In Storybook with touch emulation (DevTools device
mode, an iPhone preset), tap the default info trigger in `Playground`. If
the tooltip appears and stays up, skip to Done and say so in the PR. If it
doesn't, implement the following.

Why: for touch input, `pointerleave` fires when the finger lifts and cancels
the open timer. iOS Safari also doesn't focus a `<button>` on tap, so
`onFocus` doesn't open it either.

Behavior (`useTooltip.ts`, wired up in `Tooltip.tsx`):

- `onPointerEnter` / `onPointerLeave` ignore events whose
  `pointerType === 'touch'`.
- **Default info trigger only:** a touch tap toggles a `pinned` flag. Track
  the last `pointerType` from `onPointerDown`, and toggle in `onClick` when
  it was `'touch'`. Add `pinned` to `TooltipActivity`, so `isOpenRequested`
  also counts `pinned`. Open immediately on a tap. No open delay for a
  deliberate tap.
- A pinned tooltip closes on a second tap of the trigger, on a
  `pointerdown` outside `.root` (listen on `document` only while pinned), or
  on Escape. Escape follows rule 1.
- Custom child triggers are unchanged. Their own click handler still runs,
  and Tooltip does not toggle on tap.
- Mouse and keyboard behavior is unchanged.

Tests:

- [ ] `user.pointer` with `pointerType: 'touch'` tapping the default trigger
      shows the tooltip, and it stays after the finger lifts.
- [ ] Tapping again, or tapping outside, hides it.
- [ ] Tapping a custom child trigger calls the child's `onClick` and does not
      toggle the tooltip.
- [ ] Existing hover, focus and Escape tests are unchanged and pass.

## Files touched

```
src/design-system/components/Tooltip/useTooltip.ts
src/design-system/components/Tooltip/utils.ts        (TooltipActivity, isOpenRequested)
src/design-system/components/Tooltip/Tooltip.tsx     (only for #3 wiring)
src/design-system/components/Tooltip/Tooltip.module.css
src/design-system/components/Tooltip/Tooltip.test.tsx
```

## Done

- [ ] `npm run lint`, `typecheck`, `test:unit`, `test:storybook`, `build` and
      `build-storybook` pass in CI.
- [ ] The PR description is updated: a short note per fix, plus the
      forced-colors screenshot and the touch result (reproduced and fixed,
      or not reproduced).
- [ ] JSDoc on `useTooltip` mentions the touch behavior and why Escape only
      stops propagation when the tooltip is visible.

## Out of scope

- The `utils.ts:58` nit (throwing on a missing label). Leave it as is.
- Viewport collision handling. Add one JSDoc line on `Tooltip` saying that
  placement is fixed and isn't flipped near viewport edges.
