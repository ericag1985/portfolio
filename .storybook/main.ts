import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: '@storybook/react-vite',
  async viteFinal(viteConfig, { configType }) {
    if (configType !== 'PRODUCTION') {
      return viteConfig;
    }

    return mergeConfig(viteConfig, {
      base: '/portfolio/storybook/',
    });
  },
};

export default config;
