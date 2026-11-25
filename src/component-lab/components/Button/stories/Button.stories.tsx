import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Section, Sheet } from '../../../foundations/sheet';
import '../../../foundations/foundations.css';
import { iconNames } from '../../Icon';
import { Button, sizes, variants } from '../index';
import './Button.stories.css';

const meta = {
  title: 'Component lab/Button',
  component: Button,
  tags: ['autodocs'],
  args: { label: 'Save changes', variant: 'primary', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: [...variants] },
    size: { control: 'inline-radio', options: [...sizes] },
    icon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A native button with four variants, three sizes, and an icon-only mode. `label` is always required. A bare icon name makes the button icon-only: its label is the tooltip and the accessible name.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="button-story">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('button', { name: 'Save changes' }),
    ).toHaveAttribute('type', 'button');
  },
};

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Destructive: Story = { args: { variant: 'destructive' } };
export const Link: Story = { args: { variant: 'link' } };
export const Disabled: Story = { args: { disabled: true } };

export const IconStart: Story = {
  args: { label: 'Add', icon: { name: 'plus', placement: 'start' } },
};

export const IconEnd: Story = {
  args: { label: 'Next', icon: { name: 'arrow-right', placement: 'end' } },
};

export const IconOnly: Story = {
  args: { label: 'More info', icon: 'info' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'More info' });
    const tooltip = canvas.getByRole('tooltip', { hidden: true });

    await expect(tooltip).not.toBeVisible();
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await waitFor(() => expect(tooltip).toBeVisible());
  },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="button-sheet-row">
      {sizes.map((size) => (
        <Button key={size} label={size} size={size} />
      ))}
      {sizes.map((size) => (
        <Button
          key={`i-${size}`}
          label={`Info ${size}`}
          icon="info"
          size={size}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rem = Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    const minimums = { sm: 2 * rem, md: 2.5 * rem, lg: 3 * rem };

    for (const size of sizes) {
      const text = canvas.getByRole('button', { name: size });
      const box = text.getBoundingClientRect();
      await expect(box.height).toBeGreaterThanOrEqual(minimums[size] - 0.5);
      await expect(box.width).toBeGreaterThanOrEqual(24);

      const iconBox = canvas
        .getByRole('button', { name: `Info ${size}` })
        .getBoundingClientRect();
      await expect(Math.abs(iconBox.width - iconBox.height)).toBeLessThan(1);
      await expect(iconBox.height).toBeGreaterThanOrEqual(minimums[size] - 0.5);
    }

    const lg = canvas.getByRole('button', { name: 'Info lg' });
    await expect(lg.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
  },
};

function iconBox(button: HTMLElement): DOMRect {
  const svg = button.querySelector('svg');
  if (!svg) {
    throw new Error('Missing icon.');
  }
  return svg.getBoundingClientRect();
}

export const RightToLeft: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div dir="rtl" className="button-sheet-row">
      <Button label="Add" icon={{ name: 'plus', placement: 'start' }} />
      <Button label="Next" icon={{ name: 'arrow-right', placement: 'end' }} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const start = canvas.getByRole('button', { name: 'Add' });
    const end = canvas.getByRole('button', { name: 'Next' });
    const startIcon = iconBox(start);
    const endIcon = iconBox(end);

    await expect(startIcon.left).toBeGreaterThan(
      start.getBoundingClientRect().left +
        start.getBoundingClientRect().width / 2,
    );
    await expect(endIcon.right).toBeLessThan(
      end.getBoundingClientRect().left + end.getBoundingClientRect().width / 2,
    );
  },
};

const states = [
  { name: 'default', props: {} },
  { name: 'hover', props: { 'data-force-state': 'hover' } },
  { name: 'active', props: { 'data-force-state': 'active' } },
  { name: 'focus-visible', props: { 'data-force-state': 'focus-visible' } },
  { name: 'disabled', props: { disabled: true } },
] as const;

export const StickerSheet: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    a11y: { test: 'off' },
  },
  render: () => (
    <Sheet title="Button">
      {sizes.map((size) => (
        <Section key={size} title={`Size ${size}`}>
          <div className="button-sheet-grid">
            {variants.flatMap((variant) =>
              states.map(({ name, props }) => (
                <div key={`${variant}-${name}`} className="button-sheet-cell">
                  <Button
                    label={variant}
                    variant={variant}
                    size={size}
                    {...props}
                  />
                  <p className="button-sheet-label">{name}</p>
                </div>
              )),
            )}
          </div>
        </Section>
      ))}
      <Section title="Icons">
        <div className="button-sheet-row">
          <Button label="Add" icon={{ name: 'plus', placement: 'start' }} />
          <Button
            label="Next"
            icon={{ name: 'arrow-right', placement: 'end' }}
            variant="secondary"
          />
          {iconNames.map((name) => (
            <Button key={name} label={name} icon={name} variant="secondary" />
          ))}
        </div>
      </Section>
    </Sheet>
  ),
};
