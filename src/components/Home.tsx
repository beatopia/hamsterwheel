import React from 'react';
import { Link } from 'react-router-dom';
import LastFmStatus from './LastFmStatus';

const email = 'kluzniak@ucsc.edu';

export default function Home() {
  const [copied, setCopied] = React.useState(false);
  const [legFrame, setLegFrame] = React.useState(1);
  const [effectsEnabled, setEffectsEnabled] = React.useState(() => window.localStorage.getItem('effects') !== 'off');
  const [hamsterReady, setHamsterReady] = React.useState(false);
  const [headerStacked, setHeaderStacked] = React.useState(false);
  const headerRowRef = React.useRef<HTMLDivElement>(null);
  const identityRef = React.useRef<HTMLDivElement>(null);
  const hamsterLegsRef = React.useRef<HTMLImageElement>(null);
  const hamsterBodyRef = React.useRef<HTMLImageElement>(null);
  const hamsterDecodeStarted = React.useRef(false);

  function syncHamsterReady() {
    const images = [hamsterLegsRef.current, hamsterBodyRef.current];
    if (images.some((image) => !image?.complete) || hamsterDecodeStarted.current) return;
    hamsterDecodeStarted.current = true;
    void Promise.all(images.map((image) => image!.decode().catch(() => undefined)))
      .then(() => setHamsterReady(true));
  }

  React.useEffect(() => {
    syncHamsterReady();
  }, []);

  React.useEffect(() => {
    const syncEffects = () => setEffectsEnabled(document.documentElement.dataset.effects !== 'off');
    const observer = new MutationObserver(syncEffects);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-effects'] });
    syncEffects();
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!effectsEnabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLegFrame(1);
      return undefined;
    }
    const timer = window.setInterval(() => setLegFrame((frame) => frame % 6 + 1), 250);
    return () => window.clearInterval(timer);
  }, [effectsEnabled]);

  React.useLayoutEffect(() => {
    const row = headerRowRef.current;
    const identity = identityRef.current;
    if (!row || !identity) return undefined;

    const measure = () => {
      const statusLine = row.querySelector<HTMLElement>('.lastfm-status-line');
      if (!statusLine) {
        setHeaderStacked(false);
        return;
      }

      const parts = Array.from(statusLine.children) as HTMLElement[];
      const internalGap = Number.parseFloat(getComputedStyle(statusLine).columnGap) || 0;
      const statusWidth = parts.reduce((width, part) => width + part.scrollWidth, 0)
        + internalGap * Math.max(0, parts.length - 1);
      const rowGap = Number.parseFloat(getComputedStyle(row).columnGap) || 0;
      setHeaderStacked(identity.offsetWidth + rowGap + statusWidth > row.clientWidth + 0.5);
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(row);
    resizeObserver.observe(identity);
    const mutationObserver = new MutationObserver(measure);
    mutationObserver.observe(row, { childList: true, characterData: true, subtree: true });
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <main className="home-main">
      <article className="prose home-copy" aria-labelledby="home-title">
        <div ref={headerRowRef} className={`home-title-row${headerStacked ? ' is-stacked' : ''}`}>
          <div ref={identityRef} className="home-identity">
            <h1 id="home-title">Kai Luzniak</h1>
            <div className="social-links" aria-label="Social profiles">
              <a href="https://github.com/beatopia" target="_blank" rel="noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.02c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.74-1.56-2.57-.29-5.27-1.29-5.27-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.16 1.18A10.96 10.96 0 0 1 12 6.37c.98 0 1.94.13 2.85.38 2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.4-2.71 5.38-5.29 5.67.42.36.78 1.06.78 2.15v3.04c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .7Z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/kailuzniak/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5.34 3.5A1.84 1.84 0 1 1 1.67 3.5a1.84 1.84 0 0 1 3.67 0ZM1.98 7h3.04v9.78H1.98V7Zm4.94 0h2.91v1.34h.04c.41-.77 1.4-1.58 2.88-1.58 3.08 0 3.65 2.03 3.65 4.67v5.35h-3.03v-4.74c0-1.13-.02-2.58-1.57-2.58-1.57 0-1.81 1.23-1.81 2.5v4.82H6.92V7Z" transform="translate(2.8 1.8) scale(1.05)"/></svg>
              </a>
            </div>
          </div>
          <LastFmStatus />
        </div>
        <p>I am a student at UCSC pursuing my bachelor’s in computer science. I enjoy thinking in systems, whether that means mastering a game, designing software, or structuring my own habits so the best choice is also the easiest one. I am especially interested in backend and infrastructure work, where I can think about how information moves through a system and how to make it simpler, faster, or more reliable. I also like building small tools around problems I run into myself. Check out my <Link to="/projects">full list of projects here.</Link></p>
        <p>In my free time, I really enjoy hiking, competitive and strategy games, and music. I’ve been Top 500 in Overwatch since middle school and <a href="https://www.youtube.com/watch?v=b6uoC425zr0&t" target="_blank" rel="noopener noreferrer">currently compete for UCSC in D1 collegiate Overwatch</a>. I’ve also made a new playlist every month for the past four years as a way to keep track of how my taste changes over time. I think the music you listen to says a lot about what you were thinking or feeling at the time, so in that sense, my playlists have become little time capsules of who I was when I made them. I always enjoy discovering new music or trails, so please bless me with your recommendations! :3</p>
        <p>I'd love to talk about anything! Reach me at <button className="text-link" type="button" onClick={copyEmail} aria-live="polite">{copied ? 'copied!' : 'kluzniak AT ucsc DOT edu'}</button>.</p>
        <div className="home-artwork" tabIndex={0}>
          {!hamsterReady && <span className="artwork-skeleton hamster-artwork-skeleton" aria-hidden="true" />}
          <img className="cat-art" src="/media/images/catbatinvert.png" alt="Here is a cat-bat my dad drew." width="1920" height="1484" loading="eager" decoding="async" fetchPriority="high" draggable={false} />
          <div className={`hamster-art${hamsterReady ? ' is-ready' : ''}`} role="img" aria-label="Here is a hamster-spider I drew.">
            <img ref={hamsterLegsRef} className="hamster-legs" src={`/media/images/hamster/legs${legFrame}.png`} alt="" width="1200" height="900" loading="eager" decoding="async" fetchPriority="high" onLoad={syncHamsterReady} onError={() => setHamsterReady(true)} draggable={false} />
            <img ref={hamsterBodyRef} className="hamster-body" src="/media/images/hamster/body1.png" alt="" width="1200" height="900" loading="eager" decoding="async" fetchPriority="high" onLoad={syncHamsterReady} onError={() => setHamsterReady(true)} draggable={false} />
            <img className="hamster-body-two" src="/media/images/hamster/body2.png" alt="" width="1200" height="900" decoding="async" draggable={false} />
          </div>
          <span className="art-note cat-note" aria-hidden="true">&lt;--- Here is a cat-bat my dad drew.</span>
          <span className="art-note hamster-note" aria-hidden="true">&lt;--- Here is a hamster-spider I drew.</span>
        </div>
      </article>
    </main>
  );
}
