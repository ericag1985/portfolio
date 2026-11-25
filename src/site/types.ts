export type Role = {
  title: string;
  start: string;
  end: string;
  bullets: string[];
};

export type Employer = {
  name: string;
  location: string;
  dates: string;
  summary?: string;
  roles: Role[];
};

export type Certification = {
  name: string;
  issuer: string;
  year: string;
};

export type SectionId = 'about' | 'experience' | 'component-lab';

export type LabLink = { label: string; path: string };

export type LabCard = {
  title: string;
  description: string;
  /** The primary Storybook link, relative to the Storybook base url. */
  path: string;
  /** Other pages for the same card. */
  more?: LabLink[];
};
