import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Section, Sheet } from '../../../foundations/sheet';
import '../../../foundations/foundations.css';
import { Button } from '../../Button';
import { Icon } from '../../Icon';
import { Tooltip, namings, placements } from '../index';
import './Tooltip.stories.css';

const meta = {
  title: 'Design System/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: 'Saves the current draft',
    naming: 'description',
    placement: 'top',
    children: (
      <button type="button" className="tooltip-story-text-trigger">
        Save changes
      </button>
    ),
  },
  argTypes: {
    naming: { control: 'inline-radio', options: [...namings] },
    placement: { control: 'inline-radio', options: [...placements] },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Supplementary text for one focusable child, shown on hover or focus. Never put information in a tooltip that is not available some other way. The pointer can move onto the bubble, and Escape hides it without moving focus. `description` sets aria-describedby; `label` sets aria-labelledby so an icon-only control is named once.',
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
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

function bubbleOf(trigger: HTMLElement): HTMLElement {
  const bubble = trigger.parentElement?.querySelector('[role="tooltip"]');
  if (!(bubble instanceof HTMLElement)) {
    throw new Error('Missing tooltip.');
  }
  return bubble;
}

function centerX(box: DOMRect): number {
  return box.left + box.width / 2;
}

/** The caret is a pseudo-element, so its center comes from its computed left. */
function caretCenterX(bubble: HTMLElement): number {
  const style = getComputedStyle(bubble);
  return (
    bubble.getBoundingClientRect().left +
    Number.parseFloat(style.borderLeftWidth) +
    Number.parseFloat(getComputedStyle(bubble, '::after').left)
  );
}

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Save changes' });
    const tooltip = canvas.getByRole('tooltip', { hidden: true });

    await expect(button).toHaveAccessibleDescription('Saves the current draft');
    await expect(tooltip).not.toBeVisible();

    await userEvent.tab();
    await expect(button).toHaveFocus();
    await waitFor(() => expect(tooltip).toBeVisible());
  },
};

export const Top: Story = {
  args: { placement: 'top' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Save changes' });
    const tooltip = bubbleOf(button);

    await userEvent.hover(button);
    await expect(tooltip).not.toBeVisible();
    await waitFor(() => expect(tooltip).toBeVisible());
    await expect(tooltip.getBoundingClientRect().bottom).toBeLessThan(
      button.getBoundingClientRect().top,
    );

    await userEvent.hover(tooltip);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(tooltip).toBeVisible();

    await userEvent.unhover(tooltip);
    await waitFor(() => expect(tooltip).not.toBeVisible());
  },
};

export const Bottom: Story = {
  args: { placement: 'bottom' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Save changes' });
    const tooltip = bubbleOf(button);

    await userEvent.hover(button);
    await waitFor(() => expect(tooltip).toBeVisible());
    await expect(tooltip.getBoundingClientRect().top).toBeGreaterThan(
      button.getBoundingClientRect().bottom,
    );

    await userEvent.keyboard('{Escape}');
    await expect(tooltip).not.toBeVisible();
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(tooltip).not.toBeVisible();

    await userEvent.unhover(button);
    await userEvent.hover(button);
    await waitFor(() => expect(tooltip).toBeVisible());
  },
};

export const LabelNaming: Story = {
  args: { content: 'More info', naming: 'label' },
  parameters: {
    docs: {
      description: {
        story:
          'An icon-only Button wraps itself in a Tooltip with naming="label", so aria-labelledby names it with the tooltip text and the name is read once.',
      },
    },
  },
  render: () => <Button label="More info" icon="info" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'More info' });
    await expect(button).not.toHaveAccessibleDescription();
  },
};

const edgeCopy = 'Stays at least one space step from the edge of the viewport.';

export const EdgeOfViewport: Story = {
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  render: () => (
    <div className="tooltip-story-edges">
      {['Left edge', 'Right edge'].map((name) => (
        <Tooltip key={name} content={edgeCopy} placement="bottom">
          <button
            type="button"
            aria-label={name}
            className="tooltip-story-icon-trigger"
          >
            <Icon name="info" />
          </button>
        </Tooltip>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const viewportWidth = document.documentElement.clientWidth;

    for (const name of ['Left edge', 'Right edge']) {
      const button = canvas.getByRole('button', { name });
      const tooltip = bubbleOf(button);

      await userEvent.hover(button);
      await waitFor(() => expect(tooltip).toBeVisible());

      const box = tooltip.getBoundingClientRect();
      await expect(box.left).toBeGreaterThanOrEqual(0);
      await expect(box.right).toBeLessThanOrEqual(viewportWidth);
      await expect(
        Math.abs(
          caretCenterX(tooltip) - centerX(button.getBoundingClientRect()),
        ),
      ).toBeLessThanOrEqual(1);

      await userEvent.unhover(button);
    }
  },
};

export const RightToLeft: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div dir="rtl" className="tooltip-sheet-open tooltip-sheet-grid">
      {placements.map((placement) => (
        <div key={placement} className="tooltip-sheet-cell">
          <Tooltip content="Centered" placement={placement}>
            <button type="button" className="tooltip-story-text-trigger">
              {placement}
            </button>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const placement of placements) {
      const button = canvas.getByRole('button', { name: placement });
      const tooltip = bubbleOf(button);
      const buttonCenter = centerX(button.getBoundingClientRect());

      await expect(
        Math.abs(centerX(tooltip.getBoundingClientRect()) - buttonCenter),
      ).toBeLessThan(1);
      await expect(Math.abs(caretCenterX(tooltip) - buttonCenter)).toBeLessThan(
        1,
      );
    }
  },
};

export const StickerSheet: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    a11y: { test: 'off' },
  },
  render: () => (
    <div className="tooltip-sheet-open">
      <Sheet title="Tooltip">
        <Section title="Placement">
          <div className="tooltip-sheet-grid">
            {placements.map((placement) => (
              <div key={placement} className="tooltip-sheet-cell">
                <Tooltip
                  content="Saves the current draft"
                  placement={placement}
                >
                  <button type="button" className="tooltip-story-text-trigger">
                    Save changes
                  </button>
                </Tooltip>
                <p className="tooltip-sheet-label">{placement}</p>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Naming">
          <div className="tooltip-sheet-grid">
            <div className="tooltip-sheet-cell">
              <Tooltip content="Delete item" naming="label">
                <button type="button" className="tooltip-story-icon-trigger">
                  <Icon name="trash" />
                </button>
              </Tooltip>
              <p className="tooltip-sheet-label">label</p>
            </div>
            <div className="tooltip-sheet-cell">
              <Tooltip
                content="Drafts stay on this device until you publish them."
                placement="bottom"
              >
                <button type="button" className="tooltip-story-text-trigger">
                  Drafts
                </button>
              </Tooltip>
              <p className="tooltip-sheet-label">description, max width</p>
            </div>
          </div>
        </Section>
      </Sheet>
    </div>
  ),
};
