import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Portfolio } from '../components/Portfolio';

const meta = {
  title: 'Site/Portfolio',
  component: Portfolio,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
  args: { theme: 'light', onToggleTheme: () => undefined },
  render: (args, context) => (
    <Portfolio
      {...args}
      theme={context.globals.theme === 'dark' ? 'dark' : 'light'}
    />
  ),
} satisfies Meta<typeof Portfolio>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The whole page. Use the toolbar to switch between light and dark. */
export const Page: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Erica Gugliemella' }),
    ).toBeVisible();
    await expect(canvas.getByRole('main')).toBeVisible();
  },
};

/**
 * Runs in real Chromium, where `:focus-visible` and the stylesheet apply
 * (jsdom does neither).
 */
export const SkipLinkFocusesMain: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    const skipLink = canvas.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toHaveFocus();
    // Changing the hash would reload the test iframe; the click handler still
    // moves focus to `main`.
    skipLink.addEventListener('click', (event) => event.preventDefault());
    await userEvent.keyboard('{Enter}');

    const main = canvas.getByRole('main');
    await expect(main).toHaveFocus();
    const style = getComputedStyle(main);
    await expect(style.outlineStyle).not.toBe('none');
    await expect(parseFloat(style.outlineWidth)).toBeGreaterThan(0);
  },
};
