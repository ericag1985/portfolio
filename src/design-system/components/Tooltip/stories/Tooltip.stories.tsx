import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType, ReactElement } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { Section, Sheet } from '../../../foundations/sheet';
import '../../../foundations/foundations.css';
import { Icon } from '../../Icon';
import { Tooltip, namings, placements } from '../index';
import './Tooltip.stories.css';

/**
 * Controls edit one prop at a time, so the story args are flat. Each story
 * still renders a valid `TooltipProps` member.
 */
type TooltipStoryArgs = {
  content: string;
  label?: string;
  naming?: (typeof namings)[number];
  placement?: (typeof placements)[number];
  children?: ReactElement;
};

const meta = {
  title: 'Design System/Tooltip',
  component: Tooltip as ComponentType<TooltipStoryArgs>,
  tags: ['autodocs'],
  args: {
    content: 'Shown on hover or focus',
    label: 'More information',
    naming: 'description',
    placement: 'top',
  },
  argTypes: {
    content: {
      control: 'text',
    },
    label: {
      control: 'text',
    },
    naming: {
      control: 'inline-radio',
      options: [...namings],
      table: {
        type: { summary: "'description' | 'label'" },
      },
    },
    placement: {
      control: 'inline-radio',
      options: [...placements],
      table: {
        type: { summary: "'top' | 'bottom' | 'start' | 'end'" },
      },
    },
    children: {
      control: false,
      table: { disable: true },
    },
  },
  parameters: {
    controls: {
      include: ['content', 'label', 'naming', 'placement'],
    },
    docs: {
      description: {
        component:
          'Shows short text when the trigger is hovered or focused. The pointer can move onto the tooltip, and it stays until hover and focus both end or Escape dismisses it without moving focus. The default trigger is an info-icon button. Pass one child to use a custom trigger. `description` sets aria-describedby. `label` sets aria-labelledby so an icon-only control is named once.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="tooltip-story">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<TooltipStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'More information' });

    await userEvent.tab();
    await expect(button).toHaveFocus();
    const tooltip = await canvas.findByRole('tooltip');
    await expect(tooltip).toHaveTextContent('Shown on hover or focus');
    await expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    await expect(button).toHaveAccessibleDescription('Shown on hover or focus');
    await expect(getComputedStyle(button).width).toBe('32px');
    await expect(getComputedStyle(tooltip).fontSize).toBe('14px');
    await expect(getComputedStyle(tooltip).backgroundColor).toBe(
      'rgb(29, 29, 29)',
    );
    await expect(getComputedStyle(tooltip).color).toBe('rgb(250, 250, 250)');

    document.documentElement.dataset.theme = 'dark';
    await expect(getComputedStyle(tooltip).backgroundColor).toBe(
      'rgb(250, 250, 250)',
    );
    await expect(getComputedStyle(tooltip).color).toBe('rgb(29, 29, 29)');
    document.documentElement.dataset.theme = 'light';
  },
};

export const Top: Story = {
  args: {
    placement: 'top',
    content: 'Above the trigger',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(
      canvas.getByRole('button', { name: 'More information' }),
    );
    const tooltip = await canvas.findByRole('tooltip');
    await expect(tooltip).toHaveTextContent('Above the trigger');
    await expect(tooltip.parentElement).toHaveAttribute(
      'data-placement',
      'top',
    );
  },
};

export const Bottom: Story = {
  args: {
    placement: 'bottom',
    content: 'Below the trigger',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(
      canvas.getByRole('button', { name: 'More information' }),
    );
    const tooltip = await canvas.findByRole('tooltip');
    await expect(tooltip).toHaveTextContent('Below the trigger');
    await expect(tooltip.parentElement).toHaveAttribute(
      'data-placement',
      'bottom',
    );
  },
};

export const Start: Story = {
  args: {
    placement: 'start',
    content: 'At the start of the trigger',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(
      canvas.getByRole('button', { name: 'More information' }),
    );
    const tooltip = await canvas.findByRole('tooltip');
    await expect(tooltip).toHaveTextContent('At the start of the trigger');
    await expect(tooltip.parentElement).toHaveAttribute(
      'data-placement',
      'start',
    );
  },
};

export const End: Story = {
  args: {
    placement: 'end',
    content: 'At the end of the trigger',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(
      canvas.getByRole('button', { name: 'More information' }),
    );
    const tooltip = await canvas.findByRole('tooltip');
    await expect(tooltip).toHaveTextContent('At the end of the trigger');
    await expect(tooltip.parentElement).toHaveAttribute(
      'data-placement',
      'end',
    );
  },
};

export const CustomTrigger: Story = {
  args: {
    content: 'Saves the current draft',
    label: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'One child replaces the info button. The child keeps its own accessible name, and the tooltip describes it.',
      },
    },
  },
  render: (args) => (
    <Tooltip {...args}>
      <button type="button" className="tooltip-story-text-trigger">
        Save changes
      </button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Save changes' });
    await userEvent.hover(button);
    const tooltip = await canvas.findByRole('tooltip');
    await expect(tooltip).toHaveTextContent('Saves the current draft');
    await expect(button).toHaveAttribute('aria-describedby', tooltip.id);
  },
};

export const LabelledBy: Story = {
  args: {
    content: 'About this field',
    naming: 'label',
    label: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'aria-labelledby names the icon-only button with the tooltip text, so the name is read once. There is no separate aria-label.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'About this field' });
    await expect(button).toHaveAccessibleName('About this field');
    await expect(button).not.toHaveAttribute('aria-describedby');
    await expect(button).not.toHaveAttribute('aria-label');

    await userEvent.hover(button);
    const tooltip = await canvas.findByRole('tooltip');
    await expect(button).toHaveAttribute('aria-labelledby', tooltip.id);
  },
};

export const RightToLeft: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Top and bottom stay centered on the trigger. Start and end still follow the writing direction, and each caret points at the trigger.',
      },
    },
  },
  render: () => (
    <div dir="rtl" className="tooltip-sheet-open">
      <div className="tooltip-sheet-grid">
        {placements.map((placement) => (
          <div key={placement} className="tooltip-sheet-cell">
            <Tooltip
              content={placementCopy[placement]}
              label={placement}
              placement={placement}
            />
            <p className="tooltip-sheet-label">{placement}</p>
          </div>
        ))}
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const placement of ['top', 'bottom'] as const) {
      const button = canvas.getByRole('button', { name: placement });
      const tooltip = button.parentElement?.querySelector('[role="tooltip"]');
      if (!(tooltip instanceof HTMLElement)) {
        throw new Error(`Missing ${placement} tooltip.`);
      }

      const buttonBox = button.getBoundingClientRect();
      const tipBox = tooltip.getBoundingClientRect();
      const buttonCenter = buttonBox.left + buttonBox.width / 2;
      const tipCenter = tipBox.left + tipBox.width / 2;

      await expect(Math.abs(buttonCenter - tipCenter)).toBeLessThan(1);
      await expect(getComputedStyle(tooltip).left).not.toBe('auto');
      await expect(getComputedStyle(tooltip, '::after').left).not.toBe('auto');
    }
  },
};

const placementCopy = {
  top: 'Above the trigger',
  bottom: 'Below the trigger',
  start: 'At the start of the trigger',
  end: 'At the end of the trigger',
} as const satisfies Record<(typeof placements)[number], string>;

export const StickerSheet: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    a11y: {
      test: 'off',
    },
  },
  render: () => (
    <div className="tooltip-sheet-open">
      <Sheet title="Tooltip">
        <Section title="Placement and caret">
          <div className="tooltip-sheet-grid">
            {placements.map((placement) => (
              <div key={placement} className="tooltip-sheet-cell">
                <Tooltip
                  content={placementCopy[placement]}
                  label={placement}
                  placement={placement}
                />
                <p className="tooltip-sheet-label">{placement}</p>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Trigger">
          <div className="tooltip-sheet-grid">
            <div className="tooltip-sheet-cell">
              <Tooltip content="Saves the current draft">
                <button type="button" className="tooltip-story-text-trigger">
                  Save changes
                </button>
              </Tooltip>
              <p className="tooltip-sheet-label">custom trigger</p>
            </div>
            <div className="tooltip-sheet-cell">
              <Tooltip content="Delete item" naming="label">
                <button type="button" className="tooltip-story-icon-trigger">
                  <Icon name="trash" />
                </button>
              </Tooltip>
              <p className="tooltip-sheet-label">aria-labelledby</p>
            </div>
          </div>
        </Section>
        <Section title="Wrapping">
          <div className="tooltip-sheet-cell">
            <Tooltip
              content="Drafts stay on this device until you publish them."
              label="Drafts"
              placement="bottom"
            />
            <p className="tooltip-sheet-label">max width</p>
          </div>
        </Section>
      </Sheet>
    </div>
  ),
};
