import { Link, useLocation } from 'react-router-dom';
import { resumeUrl } from '../data/portfolio';

export default function Header() {
  const { pathname } = useLocation();
  const homePrefix = pathname === '/' ? '' : '/';

  return (
    <header className="site-header">
      <nav className="nav wrap" aria-label="Primary navigation">
        <Link className="wordmark" to="/" aria-label="Kai Luzniak, home">Kai Luzniak<span aria-hidden="true">_</span></Link>
        <div className="nav-links">
          <a href={`${homePrefix}#work`}>Work</a>
          <a href={`${homePrefix}#experience`}>Experience</a>
          <a href={`${homePrefix}#about`}>About</a>
          <a href={resumeUrl} target="_blank" rel="noreferrer">Resume</a>
          <Link to="/blog">Blog</Link>
        </div>
      </nav>
    </header>
  );
}
