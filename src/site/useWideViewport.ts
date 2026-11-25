import { useEffect, useState } from 'react';

function wideQuery(): string | null {
  if (typeof window.matchMedia !== 'function') {
    return null;
  }
  const width = getComputedStyle(document.documentElement)
    .getPropertyValue('--ds-breakpoint-md')
    .trim();
  return width ? `(min-width: ${width})` : null;
}

/**
 * True at or above the `--ds-breakpoint-md` token. CSS can't read a custom
 * property inside `@media`, so the token is read here and the result is
 * exposed to CSS as `data-layout`. That keeps the breakpoint in one place.
 */
export function useWideViewport(): boolean {
  const [wide, setWide] = useState(() => {
    const query = wideQuery();
    return query !== null && window.matchMedia(query).matches;
  });

  useEffect(() => {
    const query = wideQuery();
    if (query === null) {
      return;
    }
    const media = window.matchMedia(query);
    const onChange = () => {
      setWide(media.matches);
    };
    onChange();
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, []);

  return wide;
}
