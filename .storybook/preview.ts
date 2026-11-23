import type { Preview } from '@storybook/react-vite';

import '../src/design-system/styles/normalize.css';
import '../src/design-system/tokens/tokens.css';
import './preview.css';

type ThemeName = 'light' | 'dark';

function themeName(value: unknown): ThemeName {
  return value === 'dark' ? 'dark' : 'light';
}

function applyPreviewTheme(theme: ThemeName) {
  const root = document.documentElement;
  root.dataset.theme = theme;

  if (!document.body) {
    return;
  }

  const background = getComputedStyle(root)
    .getPropertyValue('--ds-color-bg-canvas')
    .trim();

  if (background) {
    document.body.style.backgroundColor = background;
    root.style.backgroundColor = background;
  }
}

applyPreviewTheme('light');

const preview: Preview = {
  initialGlobals: {
    theme: 'light',
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      applyPreviewTheme(themeName(context.globals.theme));
      return Story();
    },
  ],
  parameters: {
    a11y: {
      test: 'error',
    },
  },
};

export default preview;
