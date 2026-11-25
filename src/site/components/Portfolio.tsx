import { useRef } from 'react';

import '../styles.css';
import { useCurrentSection } from '../hooks/useCurrentSection';
import { useWideViewport } from '../hooks/useWideViewport';
import type { ThemeName } from '../theme';
import type { SectionId } from '../types';
import { About, ComponentLab, Experience } from './Sections';
import { Sidebar } from './Sidebar';

const sectionIds: readonly SectionId[] = [
  'about',
  'experience',
  'component-lab',
];

type PortfolioProps = {
  theme: ThemeName;
  onToggleTheme: () => void;
};

/**
 * The page layout. Theme state lives in the caller so a story can drive it
 * from the Storybook toolbar.
 *
 * Wide viewports get a sticky sidebar beside `main` in a two-column grid, so
 * content never slides under the sidebar and focus is never obscured by it.
 * Narrow viewports stack the sidebar on top and it does not stick.
 */
export function Portfolio({ theme, onToggleTheme }: PortfolioProps) {
  const wide = useWideViewport();
  const { current, select } = useCurrentSection(sectionIds);
  const mainRef = useRef<HTMLElement>(null);

  return (
    <div className="layout" data-layout={wide ? 'wide' : 'narrow'}>
      <a
        className="skip-link"
        href="#main"
        onClick={() => {
          mainRef.current?.focus();
        }}
      >
        Skip to main content
      </a>
      <Sidebar
        theme={theme}
        current={current}
        onSelect={select}
        onToggleTheme={onToggleTheme}
      />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <About />
        <hr className="section-rule" />
        <Experience />
        <hr className="section-rule" />
        <ComponentLab />
      </main>
    </div>
  );
}
