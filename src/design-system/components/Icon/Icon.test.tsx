import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isInaccessible } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, test } from 'vitest';

import { cssCustomProperty, tokensCss } from '../../../test/tokens';
import { icons } from './icons';
import {
  Icon,
  iconNames,
  iconSizes,
  type IconName,
  type IconProps,
  type IconSize,
} from './index';

const iconDir = dirname(fileURLToPath(import.meta.url));

const sizeToken: Record<IconSize, string> = {
  sm: 'var(--ds-icon-size-sm)',
  md: 'var(--ds-icon-size-md)',
  lg: 'var(--ds-icon-size-lg)',
};

const sizePx: Record<IconSize, string> = {
  sm: '16px',
  md: '20px',
  lg: '24px',
};

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(path);
    }
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

function svgOf(container: HTMLElement): SVGSVGElement {
  const svg = container.querySelector('svg');
  if (!svg) {
    throw new Error('Icon did not render an svg.');
  }
  return svg;
}

test('allowlist is plus, trash, settings, info, and arrow-right', () => {
  expect(iconNames).toEqual([
    'plus',
    'trash',
    'settings',
    'info',
    'arrow-right',
  ]);
  expect(Object.keys(icons)).toEqual(iconNames);
});

test('source imports individual icons and not the lucide barrel', () => {
  const src = resolve(iconDir, '../../..');
  const iconSource = readFileSync(resolve(iconDir, 'icons.ts'), 'utf8');

  for (const file of ['plus', 'trash-2', 'settings', 'info', 'arrow-right']) {
    expect(iconSource).toContain(`lucide-react/icons/${file}`);
  }

  for (const file of sourceFiles(src)) {
    const contents = readFileSync(file, 'utf8');
    expect(contents, file).not.toMatch(/from ['"]lucide-react(?:\/icons)?['"]/);
    expect(contents, file).not.toMatch(/from ['"]lucide-react\/dynamic/);
  }
});

test('a decorative icon is hidden from the accessibility tree', () => {
  const { container } = render(<Icon name="plus" />);
  const svg = svgOf(container);

  expect(isInaccessible(svg)).toBe(true);
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  expect(svg).toHaveAttribute('aria-hidden', 'true');
  expect(svg).toHaveAttribute('focusable', 'false');
  expect(svg).not.toHaveAttribute('role');
  expect(svg).not.toHaveAttribute('aria-label');
});

test('an empty label stays decorative', () => {
  const { container } = render(<Icon name="settings" label="  " />);

  expect(isInaccessible(svgOf(container))).toBe(true);
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

test('a labeled icon is an image with that accessible name', () => {
  render(<Icon name="trash" label=" Delete " />);
  const icon = screen.getByRole('img', { name: 'Delete' });

  expect(isInaccessible(icon)).toBe(false);
  expect(icon).toHaveAttribute('role', 'img');
  expect(icon).toHaveAttribute('aria-label', 'Delete');
  expect(icon).toHaveAttribute('focusable', 'false');
  expect(icon).not.toHaveAttribute('aria-hidden');
});

test('size maps to the icon size tokens', () => {
  for (const size of iconSizes) {
    const { container, unmount } = render(
      <Icon name="settings" size={size} label="Settings" />,
    );
    const svg = svgOf(container);

    expect(tokensCss).toContain(`--ds-icon-size-${size}: ${sizePx[size]}`);
    expect(cssCustomProperty(`--ds-icon-size-${size}`)).toBe(sizePx[size]);
    expect(svg).toHaveAttribute('width', sizeToken[size]);
    expect(svg).toHaveAttribute('height', sizeToken[size]);
    expect(getComputedStyle(svg).width).toBe(sizePx[size]);
    expect(getComputedStyle(svg).height).toBe(sizePx[size]);
    unmount();
  }
});

test('the default size is md', () => {
  const { container } = render(<Icon name="info" label="Information" />);

  expect(svgOf(container)).toHaveAttribute('width', sizeToken.md);
});

test('stroke follows currentColor in both themes', () => {
  const root = document.documentElement;
  const { container } = render(
    <p style={{ color: 'var(--ds-color-text-primary)' }}>
      <Icon name="info" label="Information" />
    </p>,
  );
  const svg = screen.getByRole('img', { name: 'Information' });
  const text = container.querySelector('p');

  if (!text) {
    throw new Error('Missing text wrapper.');
  }

  expect(svg).toHaveAttribute('stroke', 'currentColor');

  for (const [theme, color] of [
    ['light', 'rgb(29, 29, 29)'],
    ['dark', 'rgb(250, 250, 250)'],
  ] as const) {
    root.dataset.theme = theme;
    expect(cssCustomProperty('--ds-color-text-primary')).toBe(
      theme === 'light' ? '#1d1d1d' : '#fafafa',
    );
    expect(getComputedStyle(text).color).toBe(color);
    expect(getComputedStyle(svg).color).toBe(color);
  }

  delete root.dataset.theme;
});

test('forwards className, ref, and other svg attributes', () => {
  const ref = createRef<SVGSVGElement>();

  render(
    <Icon
      ref={ref}
      name="arrow-right"
      className="next"
      id="next-icon"
      label="Next"
    />,
  );

  const icon = screen.getByRole('img', { name: 'Next' });
  expect(ref.current).toBe(icon);
  expect(icon).toHaveClass('next');
  expect(icon).toHaveAttribute('id', 'next-icon');
});

test('passed stroke, role, and dimensions do not override the icon contract', () => {
  const { container } = render(
    <Icon
      {...({
        name: 'plus',
        stroke: '#ff0000',
        role: 'presentation',
        width: 4,
        height: 4,
        'aria-label': 'Ignored',
      } as unknown as IconProps)}
    />,
  );
  const svg = svgOf(container);

  expect(svg).toHaveAttribute('stroke', 'currentColor');
  expect(svg).toHaveAttribute('width', sizeToken.md);
  expect(svg).toHaveAttribute('height', sizeToken.md);
  expect(svg).toHaveAttribute('aria-hidden', 'true');
  expect(svg).not.toHaveAttribute('role');
  expect(svg).not.toHaveAttribute('aria-label');
});

function assertIconName(name: IconName) {
  return name;
}

test('names outside the allowlist are a type error', () => {
  expect(iconNames).not.toContain('camera');
  // @ts-expect-error camera is outside the icon allowlist
  assertIconName('camera');
});
