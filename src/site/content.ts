import type { LabCard } from './types';

export const siteName = 'Erica Gugliemella';
export const siteRole = 'Senior UX Engineer, design systems and accessibility';

export const aboutText =
  "I'm a front end engineer in Durham, NC who builds design systems and accessible components. For 14 years I've worked in React and TypeScript, and for 8 of those I've built the shared UI other teams build on. I'm CPACC certified, and I care most about making inclusive products the default.";

export const photoAlt =
  'Erica Gugliemella and her husband smiling in front of Spaceship Earth at Epcot at night';

export const githubUrl = 'https://github.com/ericag1985';
export const linkedinUrl = 'https://www.linkedin.com/in/egugliemella';

export const labCards: LabCard[] = [
  {
    title: 'Tokens',
    description:
      'Color, space, and type tokens that drive both themes. Colors is the main entry.',
    path: '?path=/story/foundations-colors--default',
    more: [
      {
        label: 'Spacing tokens',
        path: '?path=/story/foundations-spacing--default',
      },
      {
        label: 'Typography tokens',
        path: '?path=/story/foundations-typography--default',
      },
    ],
  },
  {
    title: 'Icon',
    description: 'An allowlisted Lucide icon that follows the text color.',
    path: '?path=/docs/design-system-icon--docs',
  },
  {
    title: 'Tooltip',
    description:
      'Supplementary text for a trigger, shown on hover and focus and dismissible with Escape.',
    path: '?path=/docs/design-system-tooltip--docs',
  },
  {
    title: 'Button',
    description:
      'A native button with four variants, three sizes, and an icon-only mode.',
    path: '?path=/docs/design-system-button--docs',
  },
];

export const storybookUrl = `${import.meta.env.BASE_URL}storybook/`;
export const resumeUrl = `${import.meta.env.BASE_URL}resume.pdf`;
