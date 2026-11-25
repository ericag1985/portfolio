import { useRef } from 'react';

import photoJpg from '../../assets/erica-epcot-800.jpg';
import photoWebp from '../../assets/erica-epcot-800.webp';
import { Button } from '../../component-lab/components/Button';
import { Icon } from '../../component-lab/components/Icon';
import {
  githubUrl,
  linkedinUrl,
  photoAlt,
  siteName,
  siteRole,
} from '../data/content';
import { useScrollEdges } from '../hooks/useScrollEdges';
import type { ThemeName } from '../theme';
import type { SectionId } from '../types';

export const navItems: { id: SectionId; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'component-lab', label: 'Component lab' },
];

type SidebarProps = {
  theme: ThemeName;
  current: SectionId;
  onSelect: (id: SectionId) => void;
  onToggleTheme: () => void;
};

/**
 * lucide-react 1.x has no brand icons, so LinkedIn and GitHub are text links.
 * The external-link icon is decorative; the hidden text carries the meaning.
 * `.external-link` scales the icon to half the text size (see styles.css).
 */
function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      className="external-link"
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      {children} <Icon name="external-link" size="sm" />{' '}
      <span className="visually-hidden">(opens in a new tab)</span>
    </a>
  );
}

/**
 * The pinned sidebar. The ring and the shapes around the photo are CSS and
 * `aria-hidden`, so a screen reader only gets the photo and its alt text.
 */
export function Sidebar({
  theme,
  current,
  onSelect,
  onToggleTheme,
}: SidebarProps) {
  const next = theme === 'dark' ? 'light' : 'dark';
  const navListRef = useRef<HTMLUListElement>(null);
  const scrollEdges = useScrollEdges(navListRef);

  return (
    <header className="sidebar">
      <div className="photo-ring">
        <span className="photo-shape photo-shape-a" aria-hidden="true" />
        <span className="photo-shape photo-shape-b" aria-hidden="true" />
        <span className="photo-shape photo-shape-c" aria-hidden="true" />
        <picture>
          <source srcSet={photoWebp} type="image/webp" />
          <img
            className="photo"
            src={photoJpg}
            alt={photoAlt}
            width={800}
            height={800}
          />
        </picture>
      </div>
      <h1 className="site-name">{siteName}</h1>
      <p className="site-role">{siteRole}</p>
      <nav
        aria-label="Site"
        data-scroll-start={scrollEdges.start ? '' : undefined}
        data-scroll-end={scrollEdges.end ? '' : undefined}
      >
        <ul ref={navListRef} className="nav-list">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current === item.id ? 'true' : undefined}
                onClick={() => {
                  onSelect(item.id);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <ExternalLink href={linkedinUrl}>LinkedIn</ExternalLink>
          </li>
          <li>
            <ExternalLink href={githubUrl}>GitHub</ExternalLink>
          </li>
        </ul>
      </nav>
      <Button
        variant="secondary"
        icon={theme === 'dark' ? 'sun' : 'moon'}
        label={`Switch to ${next} theme`}
        onClick={onToggleTheme}
      />
    </header>
  );
}
