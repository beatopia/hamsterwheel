import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createAudio } from '../utils/audio.ts';

interface PageProps {
  setPage: () => void;
}

const currentProjects = [
  {
    name: 'Slug Gaming',
    logo: '/media/images/sluggaminglogo.png',
    role: 'Web Developer',
    featured: true,
  },
  {
    name: 'Tech4Good Lab',
    logo: '/media/images/tech4goodlogo.png',
    role: 'Web Developer',
    featured: false,
  },
];

const previousInternships = [
  {
    name: 'Boeing',
    logo: '/media/images/boeinglogo.png',
    role: 'Technical Program Management Intern',
  },
  {
    name: 'Northrop Grumman',
    logo: '/media/images/northroplogo.png',
    role: 'Embedded Software Engineer Mentee (HIP)',
  },
  {
    name: 'Code Ninjas',
    logo: '/media/images/codeninjaslogo.png',
    role: 'K-12 Coding Instructor',
  },
];

export default function About({ setPage }: PageProps) {
  const navigate = useNavigate();
  const [emailCopied, setEmailCopied] = React.useState(false);
  const eggAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = React.useRef<AudioContext | null>(null);

  React.useEffect(() => {
    setPage();
    eggAudioRef.current = createAudio('/sounds/eggpop.mp3');
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
      audioContext.resume().catch(() => { });
    }

    try {
      if (audio && audioContext) {
        try {
          const source = audioContext.createMediaElementSource(audio);
          source.connect(audioContext.destination);
        } catch { }
      }
    } catch { }

    try {
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => { });
      }
    } catch { }

    navigate(to);
  };

  const copyEmail = async () => {
    const email = ['kluzniak', String.fromCharCode(64), 'ucsc', String.fromCharCode(46), 'edu'].join('');

    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      setEmailCopied(false);
    }
  };

  return (
    <section className="about-page" aria-labelledby="about-title">
      <p className="about-kicker">About</p>
      <h1 id="about-title" className="about-title about-inter">
        Hey! I&apos;m Kai Luzniak, a curious CS student who's always looking for ways to improve.
      </h1>

      <div className="about-section about-works">
        <div className="about-group">
          <div className="about-line">
            <p className="about-label about-inter">Currently contributing to</p>
            {currentProjects.map((company) => (
              <div
                key={company.name}
                className={company.featured ? 'about-chip about-chip--featured' : 'about-chip'}
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

        <div className="about-group about-group--interned">
          <div className="about-line">
            <p className="about-label about-inter">Previously at</p>
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
        I enjoy building tools that help me (and others) be more productive, and love
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
        Outside of programming, I love exploring nature, climbing, cooking, and thinking
        about music. If you're curious what I've been up to, please check out my{' '}
        <Link to="/blog" onClick={(event) => playEggAndNavigate(event, '/blog')}>
          blog
        </Link>
        !
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
          <button type="button" className="about-email-button about-inter" onClick={copyEmail}>
            kluzniak [at] ucsc [dot] edu
          </button>
          <span className="about-email-status" role="status" aria-live="polite">
            {emailCopied ? 'Copied!' : ''}
          </span>
        </p>
      </div>
    </section>
  );
}
