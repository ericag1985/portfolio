import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Portfolio } from '../Portfolio';

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
