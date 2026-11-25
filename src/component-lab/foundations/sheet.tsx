import type { ReactNode } from 'react';

export function Sheet({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="sheet">
      <h1>{title}</h1>
      {children}
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function Swatch({
  label,
  variable,
}: {
  label: string;
  variable: string;
}) {
  return (
    <div className="swatch">
      <div
        className="swatch-chip"
        style={{ backgroundColor: `var(${variable})` }}
      />
      <p className="swatch-label">{label}</p>
    </div>
  );
}
