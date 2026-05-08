import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface PageProps {
  setPage: () => void;
}

const currentProject = {
  name: 'Slug Gaming',
  logo: '/media/images/sluggaminglogo.png',
  role: 'Website Developer',
};

const previousInternships = [
  {
    name: 'Boeing',
    logo: '/media/images/boeinglogo.png',
    role: 'Program Management Intern',
  },
  {
    name: 'Northrop Grumman',
    logo: '/media/images/northroplogo.png',
    role: 'Embedded Systems Mentee (HIP)',
  },
];

export default function About({ setPage }: PageProps) {
  const navigate = useNavigate();
  const eggAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = React.useRef<AudioContext | null>(null);

  React.useEffect(() => {
    setPage();
    eggAudioRef.current = new Audio('/sounds/eggpop.mp3');
    eggAudioRef.current.preload = 'auto';
    eggAudioRef.current.volume = 1.0;
  }, [setPage]);

  function ensureAudioContext() {
    if (audioCtxRef.current) return;
    try {
      const C = (window.AudioContext || (window as any).webkitAudioContext);
      if (!C) return;
      audioCtxRef.current = new C();
    } catch (error) {
      audioCtxRef.current = null;
    }
  }

  const playEggAndNavigate = (event: React.MouseEvent, to: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    ensureAudioContext();

    const audioContext = audioCtxRef.current;
    const audio = eggAudioRef.current;
    if (audio && audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }

    try {
      if (audio && audioContext) {
        try {
          const source = audioContext.createMediaElementSource(audio);
          source.connect(audioContext.destination);
        } catch {}
      }
    } catch {}

    try {
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    } catch {}

    navigate(to);
  };

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
            <div
              className="about-chip about-chip--featured"
              aria-label={`Slug Gaming, ${currentProject.role}`}
              data-role={currentProject.role}
              tabIndex={0}
            >
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
              <div
                key={company.name}
                className="about-chip"
                aria-label={`${company.name}, ${company.role}`}
                data-role={company.role}
                tabIndex={0}
              >
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
        I enjoy building tools that help myself and others be more productive, and love
        the process of engineering. You can find my{' '}
        <Link to="/projects" onClick={(event) => playEggAndNavigate(event, '/projects')}>
          full projects list here
        </Link>
        .
      </p>

      <p className="about-copy about-copy--spaced about-inter">
        At UC Santa Cruz, I support the 3,000+ members of Slug Gaming as one of four
        executive signers, help manage the UCSC Computer Lounges as a systems
        administrator, represent Slug Gaming through Gen.G Collegiate's partner
        program, and intern with VSA. In my free time, I compete in Division I
        collegiate Overwatch as a hitscan player.
      </p>

      <p className="about-copy about-inter">
        Outside of programming, I love exploring nature, climbing, cooking, and writing
        about music. I&apos;m pretty enamored with my favorite songs, so check out my{' '}
        <Link to="/blog" onClick={(event) => playEggAndNavigate(event, '/blog')}>
          blog
        </Link>{' '}
        if you get a chance! :3
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
