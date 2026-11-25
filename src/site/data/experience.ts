import type { Certification, Employer } from '../types';

export const employers: Employer[] = [
  {
    name: 'ServiceTitan',
    location: 'Remote',
    dates: 'Feb 2025 – Nov 2026',
    roles: [
      {
        title: 'Senior UX Engineer',
        start: 'Feb 2025',
        end: 'Nov 2026',
        bullets: [
          "Built and improved React, React Native and TypeScript components for ServiceTitan's company-wide design system, the shared UI foundation used by every product team, with a focus on UX quality and WCAG conformance.",
          "Partnered with design and product throughout the process to make sure what we built matched what the design system's consumers needed, while keeping every component technically feasible and accessible.",
          'Founded a company-wide accessibility champions program open to everyone, building awareness of accessibility and giving teams a go-to place for questions and ideas grounded in Universal Design.',
          "Created an AI accessibility auditor, available in Slack and as a CI pipeline check, that audits teams' work against accessibility criteria and teaches engineers new to accessibility how to build inclusively.",
          'Used AI-first engineering workflows with Cursor, Claude and Grok Bot in day-to-day work, speeding up component development, testing and documentation.',
        ],
      },
    ],
  },
  {
    name: 'WillowTree',
    location: 'Durham, NC',
    dates: 'Oct 2018 – Aug 2022, Jan 2023 – Jan 2025',
    summary:
      'Digital product agency. Delivered many client projects, lasting from a few months to several years, including complete site refactors, financial and medical dashboards, design systems and React Native mobile apps. Worked on teams of up to 10 engineers and sometimes as the only front-end engineer.',
    roles: [
      {
        title: 'Staff Software Engineer',
        start: 'Jan 2023',
        end: 'Jan 2025',
        bullets: [
          'Led front-end architecture and implementation across a wide range of client projects in React, React Native, Angular, TypeScript and more, setting UX and accessibility standards for engineering teams of up to 10.',
          'Partnered with project and client leadership on critical technical decisions, building client trust and keeping projects on track.',
          'Built proofs of concept and took part in client pitch panels to win new business.',
          'Mentored a steady rotation of engineers (up to three at a time) and helped lead hiring, campus recruiting and cross-discipline programs focused on front-end and accessibility.',
        ],
      },
      {
        title: 'Associate Engineering Director',
        start: 'Jan 2022',
        end: 'Aug 2022',
        bullets: [
          'Managed direct reports, owning their career growth, development plans and job satisfaction.',
          'Worked with project directors to shape workstreams, delegate work and keep teams healthy; owned technical client communication, including onboarding and offboarding, embedded engineering workflows and sprint planning.',
          'Improved mentoring and hiring practices across disciplines through internal programs, office hours and workshops.',
        ],
      },
      {
        title: 'Senior Software Engineer',
        start: 'Oct 2018',
        end: 'Dec 2021',
        bullets: [
          'Built design systems and reusable component libraries for client products using React, TypeScript and Storybook.',
          'Partnered with design and test engineering to build UX and accessibility best practices into delivery.',
          'Mentored interns and colleagues in front-end and accessibility, and helped redesign the front-end interview process.',
        ],
      },
    ],
  },
  {
    name: 'Cloud Construct',
    location: 'Remote',
    dates: 'Sep 2022 – Dec 2022',
    roles: [
      {
        title: 'Senior UX Engineer',
        start: 'Sep 2022',
        end: 'Dec 2022',
        bullets: [
          'Sole full-time front-end engineer, leading all front-end development for client projects and guiding a global team of contract engineers.',
          'Created and rolled out a front-end strategy to improve client delivery and engineer retention.',
        ],
      },
    ],
  },
  {
    name: 'Isobar',
    location: 'New York, NY',
    dates: 'Jun 2014 – Sep 2018',
    roles: [
      {
        title: 'Senior Interactive Developer',
        start: 'Jun 2014',
        end: 'Sep 2018',
        bullets: [
          'Built scalable style and layout architecture for client sites, from scratch or on Foundation and Bootstrap.',
          'Led several CSS refactors on client projects, reducing defects and making implementation faster.',
        ],
      },
    ],
  },
];

export const certifications: Certification[] = [
  {
    name: 'Certified Professional in Accessibility Core Competencies (CPACC)',
    issuer: 'International Association of Accessibility Professionals (IAAP)',
    year: '2026',
  },
];
