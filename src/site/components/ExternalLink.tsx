import { Icon } from '../../component-lab/components/Icon';

type ExternalLinkProps = {
  href: string;
  children: string;
  className?: string;
};

/**
 * A link that opens in a new tab. The external-link icon is decorative; the
 * visually hidden text tells screen reader users about the new tab. The
 * `.external-link` class sizes the icon to 75% of the text (see styles.css).
 */
export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a
      className={['external-link', className].filter(Boolean).join(' ')}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      {children} <Icon name="external-link" size="sm" />
      <span className="visually-hidden">(opens in a new tab)</span>
    </a>
  );
}
