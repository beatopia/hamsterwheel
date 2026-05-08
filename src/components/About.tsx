import React from 'react';
import { Link } from 'react-router-dom';

interface PageProps {
  setPage: () => void;
}

const currentProject = {
  name: 'Slug Gaming',
  logo: '/media/images/sluggaminglogo.png',
};

const previousInternships = [
  {
    name: 'Boeing',
    logo: '/media/images/boeinglogo.png',
  },
  {
    name: 'Northrop Grumman',
    logo: '/media/images/northroplogo.png',
  },
];

export default function About({ setPage }: PageProps) {
  React.useEffect(() => {
    setPage();
  }, [setPage]);

  return (
    <section className="about-page" aria-labelledby="about-title">
      <p className="about-kicker">About</p>
      <h1 id="about-title" className="about-title about-section about-inter">
        Hey! I&apos;m Kai Luzniak, a curious computer science student.
      </h1>

      <div className="about-section about-works">
        <div className="about-group">
          <div className="about-line">
            <p className="about-label about-inter">Currently building</p>
            <div className="about-chip about-chip--featured" aria-label="Slug Gaming">
              <img
                src={currentProject.logo}
                alt="Slug Gaming logo"
                className="about-chip-logo"
              />
              <span className="about-inter">{currentProject.name}</span>
            </div>
          </div>
        </div>

        <div className="about-group about-group--interned">
          <div className="about-line">
            <p className="about-label about-inter">Previously interned at</p>
            {previousInternships.map((company) => (
              <div key={company.name} className="about-chip" aria-label={company.name}>
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="about-chip-logo"
                />
                <span className="about-inter">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="about-copy about-section about-copy--spaced about-inter">
        I am enthusiastic about building tools that help myself and others to be more
        productive and enjoy the process of crafting. You can find my{' '}
        <Link to="/projects">full projects list here</Link>.
      </p>

      <p className="about-copy about-copy--spaced about-inter">
        At UC Santa Cruz, I support the 3,000+ members of Slug Gaming as one of four
        executive signers, help manage the UCSC Computer Lounges as a systems
        administrator, represent Slug Gaming through Gen.G Collegiate, and intern with
        VSA. In my free time, I compete in Division I collegiate Overwatch as a hitscan
        player.
      </p>

      <p className="about-copy about-inter">
        Outside of programming, I love exploring nature, climbing, cooking, and writing
        about music. I&apos;m pretty enamored with my favorite songs, so check out my{' '}
        <Link to="/blog">blog</Link> if you get a chance! :3
      </p>

      <div className="about-footer">
        <p className="about-footer-label about-inter">Find me on</p>
        <div className="about-footer-links">
          <a
            href="https://github.com/beatopia"
            target="_blank"
            rel="noopener noreferrer"
            className="about-footer-link about-inter"
            aria-label="GitHub"
          >
            <img
              src="/media/images/githublogo.png"
              alt="GitHub logo"
              className="about-footer-icon"
            />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/kailuzniak/"
            target="_blank"
            rel="noopener noreferrer"
            className="about-footer-link about-inter"
            aria-label="LinkedIn"
          >
            <img
              src="/media/images/linkedinlogo.webp"
              alt="LinkedIn logo"
              className="about-footer-icon"
            />
            LinkedIn
          </a>
        </div>
        <p className="about-footer-email about-inter">
          or mail me at{' '}
          <a href="mailto:kailuzniak@gmail.com" className="about-inter">
            kailuzniak@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
