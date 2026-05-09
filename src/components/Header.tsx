import React from 'react';
import { useNavigate } from 'react-router-dom';

const links = [
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
];

export default function Header({ currentPage, onSetPage, onHamsterClick }: { currentPage: string; onSetPage: (p: string) => void; onHamsterClick: () => void; }) {
  const navigate = useNavigate();
  const clickAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const eggAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = React.useRef<AudioContext | null>(null);

  React.useEffect(() => {
    clickAudioRef.current = new Audio('/sounds/eggpop.mp3');
    eggAudioRef.current = new Audio('/sounds/sqek.mp3');
    clickAudioRef.current.preload = 'auto';
    eggAudioRef.current.preload = 'auto';
    clickAudioRef.current.volume = 1.0;
    eggAudioRef.current.volume = 1.0;
  }, []);

  function ensureAudioContext() {
    if (audioCtxRef.current) return;
    try {
      const C = (window.AudioContext || (window as any).webkitAudioContext);
      if (!C) return;
      audioCtxRef.current = new C();
    } catch (e) {
      audioCtxRef.current = null;
    }
  }

  const playThenNavigate = (e: React.MouseEvent, to: string, audio: HTMLAudioElement | null, label?: string) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    ensureAudioContext();
    const audioCtx = audioCtxRef.current;
    if (audio && audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});

    try {
      if (audio && audioCtx) {
        try {
          const src = audioCtx.createMediaElementSource(audio);
          src.connect(audioCtx.destination);
        } catch {}
      }
    } catch {}

    // Play sound fire-and-forget, then navigate immediately
    try {
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    } catch (err) {
      // ignore play errors
    }

    if (to === '/') {
      onHamsterClick();
    }

    onSetPage(label ?? '');
    navigate(to);
  };

  return (
    <div className="top-section">
      <div className="intro">
        <div className="name">Kai Luzniak</div>
        <div className="tagline">CS Student & Full-Stack Developer</div>
      </div>
      <a href="/" className="hamster-link" onClick={(e) => playThenNavigate(e, '/', eggAudioRef.current, 'home')}>
        <img className="hamster" src="/media/gifs/hamster-spins.gif" alt="spinning hamster" />
      </a>
      <nav>
        {links.map((link) => (
          <div key={link.href} className={`nav-item ${currentPage === link.label ? 'selected' : ''}`}>
            <a href={link.href} onClick={(e) => playThenNavigate(e, link.href, clickAudioRef.current, link.label)}>
              {link.label}
            </a>
            {currentPage === link.label && (
              <img className="indicator" src="/media/gifs/hamsterheadspin.gif" alt="selected" />
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
