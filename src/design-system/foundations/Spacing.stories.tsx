import type { Meta, StoryObj } from '@storybook/react-vite';

import './foundations.css';
import { Section, Sheet } from './sheet';

const spaces = [
  ['0', '0px'],
  ['1', '4px'],
  ['2', '8px'],
  ['3', '12px'],
  ['4', '16px'],
  ['6', '24px'],
  ['8', '32px'],
  ['12', '48px'],
  ['16', '64px'],
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
