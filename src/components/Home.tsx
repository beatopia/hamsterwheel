import React from 'react';

const email = 'kluzniak@ucsc.edu';

export default function Home() {
  const [copied, setCopied] = React.useState(false);
  const [legFrame, setLegFrame] = React.useState(1);

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setLegFrame((frame) => frame % 6 + 1), 250);
    return () => window.clearInterval(timer);
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
        <div className="home-title-row">
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
        <p>I am a student at UCSC pursuing my bachelor&apos;s in computer science. I enjoy thinking about systems and optimization. My professional background includes embedded software development as a mentee at Northrop Grumman and technical program management as an intern at Boeing Defense, Space & Security. I was also a coding instructor at Code Ninjas, which affirmed my passion for teaching.</p>
        <p>I enjoy thinking in systems, whether that means mastering a game, designing software, or structuring my own habits so the best choice is also the easiest one. I don't have a specific technical area I'm committed to yet, but I'm curious about performance. As of now, I mostly build applications that improve my quality of life or solve problems I find interesting. I built an Overwatch queue detector that notifies me when I find a match, as queue times scale almost exponentially in the top ~200, and I enjoy loitering around my house during the downtime. I'm also working on an osu! map recommender because I believe the existing recommenders are using the wrong metrics. </p>
        
        <p>My hobbies include games, weight training, music, hiking, and fashion. Music is especially fascinating to me. For the past four years, I&apos;ve made a new playlist every month, and I value being able to look back and see how my taste has transformed over time. I&apos;ve noticed that the music I listen to and how many songs I add to a playlist correlate to what I was experiencing that month. In that sense, my playlists are a reflection of who I was at that time in my life. I always enjoy exploring new genres or artists, and welcome any recommendations.</p>
        <p>Happy to talk. Reach me at <button className="text-link" type="button" onClick={copyEmail} aria-live="polite">{copied ? 'copied!' : 'kluzniak AT ucsc DOT edu'}</button>.</p>
        <div className="home-artwork" tabIndex={0}>
          <img className="cat-art" src="/media/images/catbatinvert.png" alt="Here is a cat-bat my dad drew." draggable={false} />
          <div className="hamster-art" role="img" aria-label="Here is a hamster-spider I drew.">
            <img className="hamster-legs" src={`/media/images/hamster/legs${legFrame}.png`} alt="" draggable={false} />
            <img className="hamster-body" src="/media/images/hamster/body1.png" alt="" draggable={false} />
            <img className="hamster-body-two" src="/media/images/hamster/body2.png" alt="" draggable={false} />
          </div>
          <span className="art-note cat-note" aria-hidden="true">&lt;--- Here is a cat-bat my dad drew.</span>
          <span className="art-note hamster-note" aria-hidden="true">&lt;--- Here is a hamster-spider I drew.</span>
        </div>
      </article>
    </main>
  );
}
