# Task: Portfolio site

## Goal

Build the portfolio site at
https://ericag1985.github.io/portfolio/ (direction B): a pinned
left sidebar and a scrolling main column with About, Experience,
and Component lab. Style only with existing design tokens. Meet
WCAG 2.2 AA.

Follow `AGENTS.md`. In site UI, use the name **Component lab**.
Never call it a "design system" as a product name. Do not rename
`src/design-system/` or existing Storybook titles
(`Design System/Button`, `Foundations/Colors`, and so on). Those
titles already define published story ids.

## Inputs

- `AGENTS.md`
- Existing site: `src/site/App.tsx`, `src/site/theme.ts`,
  `src/site/styles.css`, `src/site/App.test.tsx`, `src/main.tsx`,
  `index.html`
- Components: `src/design-system/components/{Icon,Tooltip,Button}/`
- Tokens: `src/design-system/tokens/` and generated `tokens.css`
- Shared tests: `src/test/`
- Assets already committed on this branch. Theme handling:

| Path | Theme handling |
| --- | --- |
| `src/assets/erica-epcot.jpg` | One photo, 3000×3000. Same in both themes. Metadata stripped. Archival source; do not use this on the page. |
| `src/assets/erica-epcot-800.webp` | Web photo, 800×800. Same in both themes. Use this in the page with `width={800}` and `height={800}`. Metadata stripped. |
| `src/assets/erica-epcot-800.jpg` | JPEG fallback for the web photo, in a `<picture>`. Same in both themes. Metadata stripped. |
| `public/favicon.svg` | Adaptive. An internal `prefers-color-scheme` media query uses light `color.accent.default` (`#7f3b93`, eggplant.600) and dark `color.accent.default` (`#d49be6`, eggplant.300). Update the SVG if those tokens change. |
| `public/favicon-light.png` | 32×32 PNG fallback for light. Transparent background, marks in eggplant.600. |
| `public/favicon-dark.png` | 32×32 PNG fallback for dark. Transparent background, marks in eggplant.300. |
| `public/apple-touch-icon.png` | 180×180. Single raster on eggplant.700 with eggplant.100 marks, so it stays readable on light or dark home screens. iOS does not switch touch icons by color scheme. Metadata stripped. |
| `public/og-image-light.jpg` | 1200×630 light share card. Use this in `og:image` and `twitter:image`. Crawlers do not honor color scheme. Metadata stripped. |
| `public/og-image-dark.jpg` | 1200×630 dark share card, committed so both themes are covered. Do not use it in the default meta tags. Metadata stripped. |
| `public/resume.pdf` | Erica approved this file as-is, including contact details. Serve it unchanged. Do not regenerate, edit, or strip it. |

The focus ring and trailing token shapes are CSS, not image files.
They use token colors, so they follow the theme. Lucide icons use
`currentColor`.

Photo alt text, exact: "Erica Gugliemella and her husband smiling
in front of Spaceship Earth at Epcot at night".

## Layout

Direction B.

- The skip link is the first focusable control and moves focus to
  `main`.
- Pinned left sidebar (`<header>`): the photo in the focus ring,
  the name "Erica Gugliemella" as the page's one `h1`, the role
  "Senior UX Engineer, design systems and accessibility", in-page
  nav (About, Experience, Component lab) with `aria-current="true"`
  on the current section, GitHub and LinkedIn, and the existing
  theme toggle. Reuse `src/site/theme.ts`. The site follows
  `prefers-color-scheme` until the toggle persists a choice in
  `localStorage`.
- GitHub: https://github.com/ericag1985
- LinkedIn: https://www.linkedin.com/in/egugliemella (from the
  resume Erica approved).
- The right side scrolls (`<main>` with the three sections).
- On narrow viewports the sidebar stacks on top and is not sticky.
  No breakpoint token exists. Add one (for example 48rem) and use
  it. Do not hardcode a px breakpoint in site CSS.
- Visible focus must not be hidden by the sticky sidebar (WCAG
  2.4.11). A two-column grid (sidebar, then main) is enough if
  main content never slides under the sidebar.

## Focus ring visual

The photo is circular (`--ds-radius-full`, `object-fit: cover`)
inside a dashed accent ring. A few small token-colored shapes
trail off the ring. The ring and shapes are CSS only and
`aria-hidden`. The design uses a 3px dashed stroke. Existing
border widths are 1px (`thin`) and 2px (`thick`). Add a 3px
border-width token and use it. Do not hardcode `3px` in site CSS.

Any motion is optional. If you add motion, disable it when
`prefers-reduced-motion: reduce` matches. `normalize.css` already
turns off animation, transitions, and smooth scrolling under that
condition.

## About

Exact text, no edits:

I'm a front end engineer in Durham, NC who builds design systems
and accessible components. For 14 years I've worked in React and
TypeScript, and for 8 of those I've built the shared UI other
teams build on. I'm CPACC certified, and I care most about making
inclusive products the default.

## Experience

Put role content in a typed data file, for example
`src/site/experience.ts`. Render from that file. Do not read or
export the Google Doc. Never put a phone number, email, or street
address in page text, data files, stories, or tests. City names
and "Remote" are fine. The PDF is the only approved place for
contact details.

Under Experience, a "Download resume (PDF)" link to
`${import.meta.env.BASE_URL}resume.pdf`. This is an `<a>`, not a
`Button` (Button is not a link). A decorative `download` Icon
beside the visible text is fine.

Suggested types:

```ts
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
```

Data to include, in this order:

**ServiceTitan** - Remote - Feb 2025 – Nov 2026

- Senior UX Engineer
  - Built and improved React, React Native and TypeScript
    components for ServiceTitan's company-wide design system, the
    shared UI foundation used by every product team, with a focus
    on UX quality and WCAG conformance.
  - Partnered with design and product throughout the process to
    make sure what we built matched what the design system's
    consumers needed, while keeping every component technically
    feasible and accessible.
  - Founded a company-wide accessibility champions program open to
    everyone, building awareness of accessibility and giving teams
    a go-to place for questions and ideas grounded in Universal
    Design.
  - Created an AI accessibility auditor, available in Slack and as
    a CI pipeline check, that audits teams' work against
    accessibility criteria and teaches engineers new to
    accessibility how to build inclusively.
  - Used AI-first engineering workflows with Cursor, Claude and
    Grok Bot in day-to-day work, speeding up component
    development, testing and documentation.

**WillowTree** - Durham, NC - Oct 2018 – Aug 2022, Jan 2023 –
Jan 2025

Summary: Digital product agency. Delivered many client projects,
lasting from a few months to several years, including complete
site refactors, financial and medical dashboards, design systems
and React Native mobile apps. Worked on teams of up to 10
engineers and sometimes as the only front-end engineer.

- Staff Software Engineer, Jan 2023 – Jan 2025
  - Led front-end architecture and implementation across a wide
    range of client projects in React, React Native, Angular,
    TypeScript and more, setting UX and accessibility standards
    for engineering teams of up to 10.
  - Partnered with project and client leadership on critical
    technical decisions, building client trust and keeping
    projects on track.
  - Built proofs of concept and took part in client pitch panels
    to win new business.
  - Mentored a steady rotation of engineers (up to three at a
    time) and helped lead hiring, campus recruiting and
    cross-discipline programs focused on front-end and
    accessibility.
- Associate Engineering Director, Jan 2022 – Aug 2022
  - Managed direct reports, owning their career growth,
    development plans and job satisfaction.
  - Worked with project directors to shape workstreams, delegate
    work and keep teams healthy; owned technical client
    communication, including onboarding and offboarding, embedded
    engineering workflows and sprint planning.
  - Improved mentoring and hiring practices across disciplines
    through internal programs, office hours and workshops.
- Senior Software Engineer, Oct 2018 – Dec 2021
  - Built design systems and reusable component libraries for
    client products using React, TypeScript and Storybook.
  - Partnered with design and test engineering to build UX and
    accessibility best practices into delivery.
  - Mentored interns and colleagues in front-end and
    accessibility, and helped redesign the front-end interview
    process.

**Cloud Construct** - Remote - Sep 2022 – Dec 2022

- Senior UX Engineer
  - Sole full-time front-end engineer, leading all front-end
    development for client projects and guiding a global team of
    contract engineers.
  - Created and rolled out a front-end strategy to improve client
    delivery and engineer retention.

**Isobar** - New York, NY - Jun 2014 – Sep 2018

- Senior Interactive Developer
  - Built scalable style and layout architecture for client sites,
    from scratch or on Foundation and Bootstrap.
  - Led several CSS refactors on client projects, reducing defects
    and making implementation faster.

**Certification**

- Certified Professional in Accessibility Core Competencies
  (CPACC) - International Association of Accessibility
  Professionals (IAAP), 2026

"Design system" in the bullets refers to employers' work, not the
portfolio product name. Leave that wording as written.

## Component lab

A section titled "Component lab" with four cards: Tokens, Icon,
Tooltip, and Button. Each card links to the published Storybook
page under `${import.meta.env.BASE_URL}storybook/`. Use these
ids, from the live index at
https://ericag1985.github.io/portfolio/storybook/index.json:

- Tokens: `?path=/story/foundations-colors--default`
- Icon: `?path=/docs/design-system-icon--docs`
- Tooltip: `?path=/docs/design-system-tooltip--docs`
- Button: `?path=/docs/design-system-button--docs`

Same-origin links may open in the same tab. If a Tokens card also
points at Spacing or Typography, keep Colors as the primary
entry and add secondary links to `foundations-spacing--default`
and `foundations-typography--default`.

## Icons and components

Reuse Icon, Tooltip, and Button where they fit. Icon does not yet
include `github`, `linkedin`, `download`, `sun`, or `moon`. Add
those five names to the Icon allowlist (Lucide `github`,
`linkedin`, `download`, `sun`, `moon`). Icons use `currentColor`,
so they follow the theme. Limit the change to the allowlist,
types, and any test or story that hardcodes the name union. Do
not otherwise change Icon, Tooltip, or Button behavior.

The theme toggle is the existing icon-only Button. The label is
its tooltip and accessible name: "Switch to dark theme" /
"Switch to light theme". It shows `moon` in light mode and `sun`
in dark mode. It follows `prefers-color-scheme` until chosen and
persists the choice in `localStorage`, applied before first paint.

GitHub and LinkedIn may be icon links if they have an accessible
name that includes the destination and that they open in a new
tab, or visible text plus a decorative icon. External links use
`target="_blank"` and `rel="noreferrer noopener"` and are labeled
as external.

## Tokens and CSS

Every color, space, radius, type size, border, and focus style in
site CSS comes from `--ds-*` custom properties. No hardcoded hex
or px values in site CSS. Border width, focus ring width, and
radius stay px in the token CSS; space and type stay rem. If a
value you need is missing, add a token and run
`npm run tokens:build`.

Reuse the existing focus-ring tokens for `:focus-visible`. Reuse
the existing theme toggle styles, updated as needed to sit in the
sidebar and meet target size (24×24, WCAG 2.5.8).

## HTML document

Keep `lang="en"`. Set the page title to "Erica Gugliemella -
Senior UX Engineer". Wire favicons and the light OG image in
`index.html`:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-dark.png" type="image/png" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon-light.png" type="image/png" media="(prefers-color-scheme: light)">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:title" content="Erica Gugliemella - Senior UX Engineer">
<meta property="og:image" content="https://ericag1985.github.io/portfolio/og-image-light.jpg">
<meta name="twitter:image" content="https://ericag1985.github.io/portfolio/og-image-light.jpg">
```

Vite rewrites public-root paths with the `/portfolio/` base. For
`og:image`, use the absolute production URL (crawlers need it).
Add an `og:image:alt` that describes the light share card.

Add `theme-color` with media queries for light canvas (`#ffffff`,
`color.bg.canvas`) and dark canvas (`#0f0f0f`, `color.bg.canvas`).
If those tokens change, update the meta values.

## Files touched

- `index.html`
- `src/site/`: layout, styles, experience data, tests, and a
  Storybook story for the page or its sections
- `src/assets/` (already committed; import the 800×800 web photo)
- `public/` (already committed)
- `src/design-system/components/Icon/` (allowlist only, as above)
- Token JSON plus generated `tokens.css` if you add a breakpoint
  or 3px border-width token

## Acceptance criteria

- [ ] Layout matches direction B: sticky left sidebar on wide
      viewports, stacked and not sticky on narrow viewports, skip
      link, one `h1`, About / Experience / Component lab in `main`.
- [ ] Photo uses `src/assets/erica-epcot-800.webp` (JPEG fallback)
      at width and height 800, with the exact alt text, inside the
      CSS focus ring. Decorative shapes are `aria-hidden`.
- [ ] About uses the exact paragraph in this spec.
- [ ] Experience renders from the typed data file, including every
      role and bullet in this spec, plus the CPACC line, and a "Download
      resume (PDF)" link to the committed PDF. No phone, email, or
      street address in page text.
- [ ] Component lab cards use that name and the Storybook urls
      above.
- [ ] Light and dark follow `prefers-color-scheme` and the existing
      theme toggle / `theme.ts` / `data-theme` mechanism.
- [ ] Site CSS uses only `--ds-*` tokens for color, space, radius,
      type, border, and focus. New tokens are added when a value is
      missing.
- [ ] Icon allowlist includes `github`, `linkedin`, `download`,
      `sun`, and `moon`.
- [ ] Favicon, apple-touch, and OG tags are wired as specified.
- [ ] Tests: Vitest + axe on the page in both themes; a keyboard
      tab-order test; a keyboard toggle and persistence test; a
      Storybook story for the page or sections with addon-a11y
      axe at `error` (not `off`).
- [ ] JSDoc on non-obvious code only. Follow repo conventions
      (`types.ts`, `utils.ts` when needed, `stories/`, `src/test/`
      helpers, simple types).
- [ ] The WCAG 2.2 AA checklist below all pass.

## WCAG 2.2 AA

Each item is testable.

- Semantic landmarks: `header`, `nav`, `main`.
- One `h1` and a logical heading order (sections are `h2`;
  employer or role titles are `h3` if used).
- Skip link to main content, visible on focus.
- Visible `:focus-visible` on every interactive element, not
  obscured by the sticky sidebar (2.4.11).
- Text contrast at least 4.5:1 and non-text contrast at least 3:1
  in both themes, including the dashed ring and trailing shapes
  against the sidebar background.
- Target size at least 24×24 CSS pixels (2.5.8) for nav, social
  links, the theme toggle, the resume link, and Component lab
  cards.
- Reflow at 320px CSS width with no horizontal scroll (1.4.10).
- Text spacing (1.4.12): the layout holds when line height is 1.5,
  letter spacing 0.12em, word spacing 0.16em, and paragraph
  spacing 2em.
- Resize to 200% without loss of content or function.
- Link purpose is clear from the link text or the accessible name.
  External links are labeled as external.
- `lang` on the document, and a descriptive page title.
- `prefers-reduced-motion` is respected.

## Out of scope

- Renaming `src/design-system`, changing published Storybook
  titles or story ids, or rewriting `README.md`.
- A polymorphic Button (`as="a"`).
- Contact details on the site (phone, email, street address).
- Earlier experience (2010–2014) and the skills list from the
  resume.
- Editing `public/resume.pdf`.
- Replacing or retouching the photo.

## Done

- [ ] `npm run lint`, `typecheck`, `test:unit`, `test:storybook`,
      `tokens:check`, `build`, and `build-storybook` pass.
- [ ] The PR description ticks each criterion and has a
      Verification section with the commands, a manual keyboard
      pass, a 320px reflow check, both themes, and the VoiceOver
      steps below.

## Verification

Commands: `npm run lint`, `typecheck`, `test:unit`,
`test:storybook`, `tokens:check`, `build`, and `build-storybook`.

Manual: keyboard tab order (skip link first, then sidebar, then
main); 320px reflow with no horizontal scroll; 200% zoom; both
themes via the toggle and via `prefers-color-scheme`; text spacing
as in 1.4.12.

Metadata (already done on this branch): every committed JPEG,
WebP, and PNG was saved from pixel data only with Pillow, with no
`exif` or `icc_profile` arguments. `Image.open(path).getexif()` is
empty on each of those files. The resume PDF was copied unchanged.

VoiceOver (Safari, macOS):

1. Load the site and start VoiceOver. Confirm the page title.
2. The skip link is the first control. Activate it and confirm
   focus and the virtual cursor are in `main`.
3. Read the header: the `h1`, the role, the photo alt, the nav
   (current section announced), GitHub, LinkedIn, and the theme
   toggle. Confirm the focus ring and trailing shapes are not
   announced.
4. In `main`, read About, Experience (roles and bullets), the
   resume link, and the Component lab cards. Confirm headings are
   in order.
5. Tab through every interactive element and confirm each name
   and role.

## Open decisions

None. The resume PDF is committed at `public/resume.pdf` with
Erica's approval. The LinkedIn URL is taken from that resume.
