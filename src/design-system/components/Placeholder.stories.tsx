import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Placeholder } from './Placeholder';

const meta = {
  title: 'Design System/Placeholder',
  component: Placeholder,
} satisfies Meta<typeof Placeholder>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const message = canvas.getByText('Design system placeholder');
    await expect(message.tagName).toBe('P');
  },
};

export const Stickersheet: Story = {
  parameters: {
    a11y: {
      test: 'off',
    },
  },
  render: () => (
    <>
      <Placeholder />
      <button />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button')).toBeInTheDocument();
  },
};
