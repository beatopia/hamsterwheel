import React from 'react';
import { currentItems, email, experience, projects, resumeUrl, summary } from '../data/portfolio';

const github = 'https://github.com/beatopia';
const linkedin = 'https://www.linkedin.com/in/kailuzniak/';

export default function Portfolio() {
  const [activeExperience, setActiveExperience] = React.useState<'professional' | 'extracurricular'>('professional');
  const [emailStatus, setEmailStatus] = React.useState('Email');

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setEmailStatus('Copied');
      window.setTimeout(() => setEmailStatus('Email'), 1800);
    } catch {
      const field = document.createElement('textarea');
      field.value = email;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      if (copied) {
        setEmailStatus('Copied');
        window.setTimeout(() => setEmailStatus('Email'), 1800);
      } else {
        window.location.href = `mailto:${email}`;
      }
    }
  }

  const activeItems = experience[activeExperience];

  return (
    <main>
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Computer Science · UC Santa Cruz</p>
          <h1 id="hero-title">Kai Luzniak</h1>
          <p className="hero-line">I like building tools for annoying problems and figuring out how systems move information around.</p>
          <div className="action-row" aria-label="Primary links">
            <a href={github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            <a href={resumeUrl} target="_blank" rel="noreferrer">Resume <span aria-hidden="true">↗</span></a>
            <button type="button" onClick={copyEmail}>{emailStatus}</button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="cat-caption">local build supervisor</span>
          <img src="/media/gifs/hamster-spins.gif" alt="" />
        </div>
      </section>

      <section className="summary wrap" aria-label="Current and previous work">
        {(['current', 'previous'] as const).map((group) => (
          <div className="summary-column" key={group}>
            <p className="section-label">{group === 'current' ? 'Currently' : 'Previously'}</p>
            {summary[group].map((item) => (
              <div className="summary-item" key={item.organization}>
                <strong>{item.organization}</strong>
                <span>{item.role}</span>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="section wrap" id="work" aria-labelledby="work-title">
        <header className="section-heading">
          <p className="section-label">Selected work</p>
          <h2 id="work-title">Things I’ve built because I wanted them to exist.</h2>
        </header>
        <div className="project-list">
          {projects.map((project, index) => (
            <article className={`project ${!project.image ? 'project--text-only' : ''}`} key={project.name}>
              <div className="project-copy">
                <p className="project-index">0{index + 1} / {project.eyebrow}</p>
                <h3>{project.name}</h3>
                <p className="project-statement">{project.statement}</p>
                <p className="project-description">{project.description}</p>
                <ul className="tech-list" aria-label="Technologies and topics">
                  {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
                <div className="project-links">
                  <a href={project.href} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
                  {project.article && <a href={project.article}>Read the build notes <span aria-hidden="true">→</span></a>}
                </div>
              </div>
              {project.image ? (
                <a className="project-visual" href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} on GitHub`}>
                  <img src={project.image} alt={project.imageAlt} loading="lazy" />
                </a>
              ) : (
                <div className="project-placeholder" aria-label="Screenshot coming later">
                  <span className="pixel-mark">osu!</span>
                  <small>still mapping this one out</small>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="section wrap" id="experience" aria-labelledby="experience-title">
        <header className="section-heading compact-heading">
          <p className="section-label">Experience</p>
          <h2 id="experience-title">Work, teams, and the places I show up.</h2>
        </header>
        <div className="tabs" role="tablist" aria-label="Experience type">
          <button role="tab" aria-selected={activeExperience === 'professional'} aria-controls="experience-panel" onClick={() => setActiveExperience('professional')}>Professional</button>
          <button role="tab" aria-selected={activeExperience === 'extracurricular'} aria-controls="experience-panel" onClick={() => setActiveExperience('extracurricular')}>Extracurricular</button>
        </div>
        <div className="experience-list" id="experience-panel" role="tabpanel">
          {activeItems.map((item, index) => (
            <div className="experience-item" key={`${activeExperience}-${item.organization}`}>
              <span className="experience-number">0{index + 1}</span>
              <strong>{item.organization}</strong>
              <span>{item.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section about wrap" id="about" aria-labelledby="about-title">
        <div>
          <p className="section-label">About</p>
          <h2 id="about-title">Software is usually where my interests end up.</h2>
        </div>
        <div className="about-copy">
          <p>I’m a computer science student at UC Santa Cruz. I gravitate toward systems and backend problems—especially the weird little details of how information gets from one place to another.</p>
          <p>A lot of my projects start with something I already care about, usually a game, and one question: “could I make this less annoying?” I’ve also spent a lot of time in competitive gaming, which has taught me nearly as much about teams as code has.</p>
          <p>When I’m away from a screen, I’m usually climbing, cooking with mixed results, hiking, or making a ceramic object that probably should not exist.</p>
        </div>
      </section>

      <section className="right-now wrap" aria-labelledby="now-title">
        <div className="now-title-wrap">
          <p className="section-label">Outside the terminal</p>
          <h2 id="now-title">Right now</h2>
          <img src="/media/gifs/hamster-grass.gif" alt="Pixel-art cat resting in grass" loading="lazy" />
        </div>
        <dl>
          {currentItems.map((item) => (
            <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>
          ))}
        </dl>
      </section>

      <footer className="contact wrap" id="contact">
        <div>
          <p className="section-label">Contact</p>
          <h2>Want to talk?</h2>
          <p>I’m always down to talk about software, games, or something interesting you’re building.</p>
        </div>
        <div className="contact-links">
          <button type="button" onClick={copyEmail}>{emailStatus === 'Copied' ? 'Email copied!' : email}</button>
          <a href={github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
        </div>
      </footer>
    </main>
  );
}
