import { useEffect, useState } from 'react';

import './styles.css';
import {
  applyTheme,
  initialTheme,
  persistTheme,
  storedTheme,
  type ThemeName,
} from './theme';

const storybookUrl = `${import.meta.env.BASE_URL}storybook/`;

export function App() {
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

  function onToggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    persistTheme(next);
    setTheme(next);
  }

  return (
    <>
      <header>
        <p>Erica Gugliemella</p>
        <button
          type="button"
          className="theme-toggle"
          aria-pressed={theme === 'dark'}
          onClick={onToggle}
        >
          Dark theme
        </button>
      </header>
      <main>
        <h1>Portfolio</h1>
        <p>About and resume will live here.</p>
        <p>
          <a href={storybookUrl}>Design system in Storybook</a>
        </p>
      </main>
    </>
  );
}
