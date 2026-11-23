import type { Preview } from '@storybook/react-vite';

import '../src/design-system/styles/normalize.css';
import '../src/design-system/tokens/tokens.css';

const preview: Preview = {
  parameters: {
    a11y: {
      test: 'error',
    },
  },
};

export default preview;
