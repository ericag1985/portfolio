import { Fragment } from 'react';

import { Icon } from '../../component-lab/components/Icon';
import {
  aboutText,
  iaapName,
  iaapUrl,
  labCards,
  resumeUrl,
  storybookUrl,
} from '../data/content';
import { certifications, employers } from '../data/experience';

export function About() {
  const [beforeIaap, afterIaap] = aboutText.split(iaapName);

  return (
    <section id="about" aria-labelledby="about-heading">
      <h2 id="about-heading">About</h2>
      <p>
        {beforeIaap}
        <a
          className="about-link"
          href={iaapUrl}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${iaapName} (opens in a new tab)`}
        >
          {iaapName}
        </a>
        {afterIaap}
      </p>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading">
      <h2 id="experience-heading">Experience</h2>
      <p>
        <a className="resume-link" href={resumeUrl}>
          <Icon name="download" />
          Download resume (PDF)
        </a>
      </p>
      {employers.map((employer, index) => (
        <Fragment key={employer.name}>
          {index > 0 ? <hr className="employer-rule" /> : null}
          <article className="employer">
            <h3>{employer.name}</h3>
            <p className="meta">
              {employer.location} · {employer.dates}
            </p>
            {employer.summary ? <p>{employer.summary}</p> : null}
            {employer.roles.map((role) => (
              <div key={role.title} className="role">
                <h4>{role.title}</h4>
                <p className="meta">
                  {role.start} – {role.end}
                </p>
                <ul>
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </article>
        </Fragment>
      ))}
      <h3>Certification</h3>
      <ul>
        {certifications.map((cert) => (
          <li key={cert.name}>
            {cert.name} - {cert.issuer}, {cert.year}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ComponentLab() {
  return (
    <section id="component-lab" aria-labelledby="component-lab-heading">
      <h2 id="component-lab-heading">Component lab</h2>
      <p>
        A small design system, documented in Storybook the same way I document
        one at work: tokens, accessible components, and both themes.
      </p>
      <ul className="card-list">
        {labCards.map((card) => (
          <li key={card.title} className="card">
            <h3>
              <a href={`${storybookUrl}${card.path}`}>{card.title}</a>
            </h3>
            <p>{card.description}</p>
            {card.more ? (
              <ul className="card-more">
                {card.more.map((link) => (
                  <li key={link.label}>
                    <a href={`${storybookUrl}${link.path}`}>{link.label}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
