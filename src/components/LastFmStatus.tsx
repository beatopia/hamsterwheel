import React from 'react';

const REFRESH_INTERVAL = 45_000;

interface LastFmTrack {
  title: string;
  artist: string;
  trackUrl?: string;
  artistUrl?: string;
  nowPlaying: boolean;
  playedAt?: number;
}

const LOCAL_PLACEHOLDER_TRACK: LastFmTrack = {
  title: 'cliche',
  artist: '2hollis',
  nowPlaying: true,
  playedAt: Math.floor(Date.now() / 1000),
};

function localPlaceholder() {
  return import.meta.env.DEV ? LOCAL_PLACEHOLDER_TRACK : null;
}

let cachedTrack: LastFmTrack | null = null;
let pendingRequest: Promise<LastFmTrack | null> | null = null;

function refreshTrack() {
  if (pendingRequest) return pendingRequest;

  const request = (async (): Promise<LastFmTrack | null> => {
    try {
      const response = await fetch('/api/lastfm');
      if (!response.ok) return localPlaceholder();
      const latest = await response.json() as LastFmTrack;
      if (!latest.title || !latest.artist) return localPlaceholder();
      const track = latest.nowPlaying && latest.playedAt === undefined
        ? {
            ...latest,
            playedAt: cachedTrack?.nowPlaying
              && cachedTrack.title === latest.title
              && cachedTrack.artist === latest.artist
              && cachedTrack.playedAt !== undefined
              ? cachedTrack.playedAt
              : Math.floor(Date.now() / 1000),
          }
        : latest;
      cachedTrack = track;
      return track;
    } catch {
      // Last.fm is optional; retain the previous value if the request fails.
      return localPlaceholder();
    }
  })();

  pendingRequest = request;
  void request.then(() => {
    if (pendingRequest === request) pendingRequest = null;
  });
  return request;
}

interface LastFmState {
  track: LastFmTrack | null;
  isLoading: boolean;
}

const LastFmContext = React.createContext<LastFmState>({ track: null, isLoading: true });

export function LastFmProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrack] = React.useState<LastFmTrack | null>(() => cachedTrack);
  const [isLoading, setIsLoading] = React.useState(() => cachedTrack === null);

  React.useEffect(() => {
    let active = true;

    const refresh = async () => {
      const latest = await refreshTrack();
      if (!active) return;
      if (latest) setTrack(latest);
      setIsLoading(false);
    };

    void refresh();
    const timer = window.setInterval(() => void refresh(), REFRESH_INTERVAL);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return <LastFmContext.Provider value={{ track, isLoading }}>{children}</LastFmContext.Provider>;
}

function formatRelativeTime(timestamp: number) {
  const seconds = Math.max(0, Math.floor(Date.now() / 1000 - timestamp));
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function LastFmStatus() {
  const { track, isLoading } = React.useContext(LastFmContext);
  const [hasOverflow, setHasOverflow] = React.useState(false);
  const [marqueeActive, setMarqueeActive] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const viewportRef = React.useRef<HTMLSpanElement>(null);
  const contentRef = React.useRef<HTMLSpanElement>(null);

  React.useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!track || !viewport || !content) {
      setHasOverflow(false);
      return undefined;
    }

    const measureOverflow = () => {
      const distance = content.scrollWidth - viewport.clientWidth;
      const overflowing = distance > 1;
      setHasOverflow(overflowing);
      if (overflowing) {
        const duration = Math.max(12, Math.min(32, 12 + distance / 50));
        content.style.setProperty('--lastfm-distance', `${distance}px`);
        content.style.setProperty('--lastfm-duration', `${duration}s`);
      }
    };

    measureOverflow();
    const observer = new ResizeObserver(measureOverflow);
    observer.observe(viewport);
    observer.observe(content);
    window.addEventListener('resize', measureOverflow);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measureOverflow);
    };
  }, [track?.title, track?.artist]);

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  React.useLayoutEffect(() => {
    setMarqueeActive(false);
    if (!hasOverflow || reducedMotion) return undefined;
    const timer = window.setTimeout(() => setMarqueeActive(true), 1400);
    return () => window.clearTimeout(timer);
  }, [hasOverflow, reducedMotion, track?.title, track?.artist]);

  return (
    <div className={`lastfm-status${track ? ' has-content' : ''}${!track && isLoading ? ' is-loading' : ''}`} aria-live="polite" aria-atomic="true">
      {track && (
        <div className="lastfm-status-line">
          <span className="lastfm-icon" aria-hidden="true">♫</span>
          <span className="lastfm-prefix">{track.nowPlaying ? 'I’m currently listening to' : 'The last song I listened to was'}</span>
          <span ref={viewportRef} className="lastfm-scroll-window">
            <span
              key={`${track.title}\u0000${track.artist}`}
              ref={contentRef}
              className={`lastfm-scroll-content${hasOverflow && marqueeActive && !reducedMotion ? ' is-scrolling' : ''}`}
            >
              {track.trackUrl ? <a href={track.trackUrl} target="_blank" rel="noopener noreferrer">{track.title}</a> : track.title}
              {' by '}
              {track.artistUrl ? <a href={track.artistUrl} target="_blank" rel="noopener noreferrer">{track.artist}</a> : track.artist}
            </span>
          </span>
          {track.playedAt !== undefined && (
            <span className="lastfm-timestamp">· {formatRelativeTime(track.playedAt)}</span>
          )}
        </div>
      )}
      {!track && isLoading && <div className="lastfm-status-line"><span className="lastfm-icon" aria-hidden="true">♫</span><span className="lastfm-skeleton" aria-hidden="true" /></div>}
    </div>
  );
}
