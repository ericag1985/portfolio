import { useEffect, useState } from 'react';

import {
  applyTheme,
  initialTheme,
  persistTheme,
  storedTheme,
  type ThemeName,
} from './theme';

/**
 * The page theme. It follows `prefers-color-scheme` until `toggle` stores a
 * choice, and then the stored choice wins.
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(initialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (storedTheme() !== null || typeof window.matchMedia !== 'function') {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (storedTheme() !== null) {
        return;
      }
      setTheme(media.matches ? 'dark' : 'light');
    };

    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    persistTheme(next);
    setTheme(next);
  }

  return { theme, toggle };
}
