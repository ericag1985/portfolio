import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Section, Sheet } from '../../../foundations/sheet';
import '../../../foundations/foundations.css';
import { Icon, iconNames, iconSizes } from '../index';
import './Icon.stories.css';

const meta = {
  title: 'Design System/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: {
    name: 'plus',
    size: 'md',
    label: 'Add',
  },
  argTypes: {
    name: {
      control: 'select',
      options: [...iconNames],
      table: {
        type: { summary: iconNames.map((name) => `'${name}'`).join(' | ') },
      },
    },
    size: {
      control: 'inline-radio',
      options: [...iconSizes],
      table: {
        type: { summary: "'sm' | 'md' | 'lg'" },
      },
    },
    label: {
      control: 'text',
    },
  },
  parameters: {
    controls: {
      include: ['name', 'size', 'label'],
    },
    docs: {
      description: {
        component:
          'Leave `label` unset when visible text already names the action. The icon is decorative and hidden from assistive technology. Pass `label` when the icon is the only name, such as an icon-only control: it is exposed as an image with that accessible name. Color is `currentColor`, so the glyph follows the surrounding text in light and dark themes.',
      },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Decorative: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The icons sit beside visible text, so they are decorative: no role, `aria-hidden`, and not focusable.',
      },
    },
  },
  render: () => (
    <div>
      <p className="icon-story-row">
        <Icon name="plus" />
        Add item
      </p>
      <p className="icon-story-row icon-story-accent">
        <Icon name="trash" />
        Delete item
      </p>
    </div>
  ),
};

export const Labeled: Story = {
  args: {
    name: 'info',
    size: 'lg',
    label: 'Information',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Nothing else names this icon, so `label` is its accessible name.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = canvas.getByRole('img', { name: 'Information' });
    await expect(icon).toHaveAccessibleName('Information');
  },
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Small, medium, and large map to the icon size tokens (16px, 20px, and 24px).',
      },
    },
  },
  render: () => (
    <div>
      {iconSizes.map((size) => (
        <p key={size} className="icon-story-row">
          <Icon name="arrow-right" size={size} />
          {size}
        </p>
      ))}
    </div>
  ),
};

export const StickerSheet: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    a11y: {
      test: 'off',
    },
  },
  render: () => (
    <Sheet title="Icons">
      <Section title="Allowlist">
        <div className="icon-sheet-table">
          <div className="icon-sheet-row">
            <p className="icon-sheet-label">name</p>
            {iconSizes.map((size) => (
              <p key={size} className="icon-sheet-label">
                {size}
              </p>
            ))}
          </div>
          {iconNames.map((name) => (
            <div key={name} className="icon-sheet-row">
              <p className="icon-sheet-label">{name}</p>
              {iconSizes.map((size) => (
                <Icon key={size} name={name} size={size} />
              ))}
            </div>
          ))}
        </div>
      </Section>
    </Sheet>
  ),
};
