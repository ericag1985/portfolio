import type { Meta, StoryObj } from '@storybook/react-vite';

import './foundations.css';
import { Section, Sheet } from './sheet';

const spaces = [
  ['0', '0'],
  ['1', '0.25rem'],
  ['2', '0.5rem'],
  ['3', '0.75rem'],
  ['4', '1rem'],
  ['6', '1.5rem'],
  ['8', '2rem'],
  ['12', '3rem'],
  ['16', '4rem'],
] as const;

const radii = [
  ['none', '0px'],
  ['sm', '4px'],
  ['md', '8px'],
  ['lg', '12px'],
  ['full', '9999px'],
] as const;

function SpacingSheet() {
  return (
    <Sheet title="Spacing and radius">
      <Section title="Spacing">
        {spaces.map(([step, size]) => (
          <div key={step} className="space-row">
            <p className="space-label">
              space.{step} · {size}
            </p>
            <div
              className="space-bar"
              style={{ width: `var(--ds-space-${step})` }}
            />
          </div>
        ))}
      </Section>
      <Section title="Radius">
        <div className="radius-grid">
          {radii.map(([name, size]) => (
            <div key={name} className="radius-item">
              <div
                className="radius-box"
                style={{ borderRadius: `var(--ds-radius-${name})` }}
              />
              <p className="radius-label">
                {name} · {size}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </Sheet>
  );
}

const meta = {
  title: 'Foundations/Spacing',
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
  render: () => <SpacingSheet />,
};
