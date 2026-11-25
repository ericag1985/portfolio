import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * Runs axe on a container and fails with the rule ids and nodes it finds.
 * jsdom has no layout or computed color, so `color-contrast` can't run here.
 * Contrast is covered by the token contrast tests and by the Storybook axe
 * check in a real browser.
 */
export async function expectNoAxeViolations(container: Element) {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } },
  });
  const summary = results.violations.map(
    (violation) =>
      `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
  );
  expect(summary).toEqual([]);
}
