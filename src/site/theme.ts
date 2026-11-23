export const themeStorageKey = 'theme';

export type ThemeName = 'light' | 'dark';

export function systemTheme(): ThemeName {
  if (typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function storedTheme(): ThemeName | null {
  try {
    const value = localStorage.getItem(themeStorageKey);
    if (value === 'light' || value === 'dark') {
      return value;
    }
  } catch {
    return null;
  }

  return null;
}

export function initialTheme(): ThemeName {
  return storedTheme() ?? systemTheme();
}

export function persistTheme(theme: ThemeName) {
  localStorage.setItem(themeStorageKey, theme);
}

export function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute('data-theme', theme);
}
