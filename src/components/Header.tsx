import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Home', to: '/', end: true },
  { label: 'Blog', to: '/blog', end: false },
  { label: 'Projects', to: '/projects', end: true },
];

type ThemePreference = 'light' | 'system' | 'dark';

function resolveTheme(preference: ThemePreference) {
  if (preference !== 'system') return preference;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function ThemeControls() {
  const [preference, setPreference] = React.useState<ThemePreference>(() => {
    const saved = window.localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
  });

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const applyTheme = () => {
      document.documentElement.dataset.theme = resolveTheme(preference);
      document.documentElement.dataset.themePreference = preference;
    };

    applyTheme();
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [preference]);

  function chooseTheme(theme: ThemePreference) {
    window.localStorage.setItem('theme', theme);
    setPreference(theme);
  }

  return (
    <div className="theme-controls" aria-label="Color theme">
      <button type="button" aria-label="Use light theme" aria-pressed={preference === 'light'} onClick={() => chooseTheme('light')}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg>
      </button>
      <button type="button" aria-label="Use system theme" aria-pressed={preference === 'system'} onClick={() => chooseTheme('system')}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/></svg>
      </button>
      <button type="button" aria-label="Use dark theme" aria-pressed={preference === 'dark'} onClick={() => chooseTheme('dark')}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.4A8.5 8.5 0 0 1 8.6 3.5 8.5 8.5 0 1 0 20.5 15.4Z"/></svg>
      </button>
    </div>
  );
}

export default function Header() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <ThemeControls />
    </header>
  );
}
