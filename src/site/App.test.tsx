import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { App } from './App';

test('renders the portfolio heading and Storybook link', async () => {
  const user = userEvent.setup();

  render(<App />);

  expect(
    screen.getByRole('heading', { level: 1, name: 'Portfolio' }),
  ).toBeInTheDocument();

  const storybookLink = screen.getByRole('link', {
    name: 'Design system in Storybook',
  });

  expect(storybookLink).toHaveAttribute(
    'href',
    `${import.meta.env.BASE_URL}storybook/`,
  );

  await user.tab();

  expect(storybookLink).toHaveFocus();
});
