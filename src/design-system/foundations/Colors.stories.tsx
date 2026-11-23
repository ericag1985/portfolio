import type { Meta, StoryObj } from '@storybook/react-vite';

import './foundations.css';
import { Section, Sheet, Swatch } from './sheet';

const rampSteps = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const;

function ramp(name: string) {
  return rampSteps.map((step) => ({
    label: `${name}.${step}`,
    variable: `--ds-color-${name}-${step}`,
  }));
}

const groups = [
  {
    title: 'White, gray, and black',
    swatches: [
      { label: 'white', variable: '--ds-color-white' },
      ...ramp('gray'),
      { label: 'black', variable: '--ds-color-black' },
    ],
  },
  { title: 'Eggplant', swatches: ramp('eggplant') },
  { title: 'Red', swatches: ramp('red') },
  {
    title: 'Background',
    swatches: [
      'canvas',
      'surface',
      'surface-raised',
      'inverse',
      'transparent',
    ].map((name) => ({
      label: `bg.${name}`,
      variable: `--ds-color-bg-${name}`,
    })),
  },
  {
    title: 'Text',
    swatches: [
      'primary',
      'secondary',
      'muted',
      'inverse',
      'on-accent',
      'on-danger',
      'link',
    ].map((name) => ({
      label: `text.${name}`,
      variable: `--ds-color-text-${name}`,
    })),
  },
  {
    title: 'Border',
    swatches: ['default', 'strong', 'focus'].map((name) => ({
      label: `border.${name}`,
      variable: `--ds-color-border-${name}`,
    })),
  },
  {
    title: 'Accent',
    swatches: ['default', 'hover', 'active', 'subtle'].map((name) => ({
      label: `accent.${name}`,
      variable: `--ds-color-accent-${name}`,
    })),
  },
  {
    title: 'Danger',
    swatches: ['default', 'hover', 'active', 'subtle'].map((name) => ({
      label: `danger.${name}`,
      variable: `--ds-color-danger-${name}`,
    })),
  },
];

function ColorsSheet() {
  return (
    <Sheet title="Colors">
      {groups.map((group) => (
        <Section key={group.title} title={group.title}>
          <div className="swatch-grid">
            {group.swatches.map((swatch) => (
              <Swatch
                key={swatch.label}
                label={swatch.label}
                variable={swatch.variable}
              />
            ))}
          </div>
        </Section>
      ))}
    </Sheet>
  );
}

const meta = {
  title: 'Foundations/Colors',
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
  render: () => <ColorsSheet />,
};
