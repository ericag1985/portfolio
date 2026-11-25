import type { Meta, StoryObj } from '@storybook/react-vite';

import './foundations.css';
import { Sheet } from './sheet';

const steps = [
  ['12', '0.75rem', '1.333'],
  ['14', '0.875rem', '1.429'],
  ['16', '1rem', '1.5'],
  ['18', '1.125rem', '1.556'],
  ['20', '1.25rem', '1.4'],
  ['24', '1.5rem', '1.333'],
  ['30', '1.875rem', '1.267'],
  ['36', '2.25rem', '1.222'],
  ['48', '3rem', '1.167'],
] as const;

function TypographySheet() {
  return (
    <Sheet title="Typography">
      {steps.map(([step, size, lineHeight]) => (
        <div key={step} className="type-step">
          <p className="type-step-label">
            {step} · {size} / {lineHeight}
          </p>
          <p
            style={{
              fontSize: `var(--ds-font-size-${step})`,
              lineHeight: `var(--ds-font-line-height-${step})`,
            }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      ))}
    </Sheet>
  );
}

const meta = {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'off',
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TypographySheet />,
};
