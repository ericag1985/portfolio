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
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Storage is blocked. The theme still applies; it just isn't remembered.
  }
}

export function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute('data-theme', theme);
}
