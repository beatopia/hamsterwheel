import React from 'react';

const REFRESH_INTERVAL = 45_000;
const RELATIVE_TIME = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

interface LastFmTrack {
  title: string;
  artist: string;
  trackUrl?: string;
  artistUrl?: string;
  nowPlaying: boolean;
  playedAt?: number;
}

let cachedTrack: LastFmTrack | null = null;
let pendingRequest: Promise<LastFmTrack | null> | null = null;

function refreshTrack() {
  if (pendingRequest) return pendingRequest;

  const request = (async (): Promise<LastFmTrack | null> => {
    try {
      const response = await fetch('/api/lastfm');
      if (!response.ok) return null;
      const latest = await response.json() as LastFmTrack;
      if (!latest.title || !latest.artist) return null;
      cachedTrack = latest;
      return latest;
    } catch {
      // Last.fm is optional; retain the previous value if the request fails.
      return null;
    }
  })();

  pendingRequest = request;
  void request.then(() => {
    if (pendingRequest === request) pendingRequest = null;
  });
  return request;
}

const LastFmContext = React.createContext<LastFmTrack | null>(null);

export function LastFmProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrack] = React.useState<LastFmTrack | null>(() => cachedTrack);

  React.useEffect(() => {
    let active = true;

    const refresh = async () => {
      const latest = await refreshTrack();
      if (active && latest) setTrack(latest);
    };

    void refresh();
    const timer = window.setInterval(() => void refresh(), REFRESH_INTERVAL);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return <LastFmContext.Provider value={track}>{children}</LastFmContext.Provider>;
}

function formatRelativeTime(timestamp: number) {
  const seconds = Math.round(timestamp - Date.now() / 1000);
  if (Math.abs(seconds) < 60) return RELATIVE_TIME.format(0, 'second');
  if (Math.abs(seconds) < 3600) return RELATIVE_TIME.format(Math.round(seconds / 60), 'minute');
  if (Math.abs(seconds) < 86400) return RELATIVE_TIME.format(Math.round(seconds / 3600), 'hour');
  return RELATIVE_TIME.format(Math.round(seconds / 86400), 'day');
}

export default function LastFmStatus() {
  const track = React.useContext(LastFmContext);
  const showLocalPlaceholder = !track && import.meta.env.DEV;

  return (
    <div className={`lastfm-status${track || showLocalPlaceholder ? ' has-content' : ''}`} aria-live="polite" aria-atomic="true">
      {track && (
        <>
          <div>
            <span aria-hidden="true">♫ </span>{track.nowPlaying ? 'Now playing: ' : 'Last played: '}
            {track.trackUrl ? <a href={track.trackUrl} target="_blank" rel="noopener noreferrer">{track.title}</a> : track.title}
            {' by '}
            {track.artistUrl ? <a href={track.artistUrl} target="_blank" rel="noopener noreferrer">{track.artist}</a> : track.artist}
          </div>
          {!track.nowPlaying && track.playedAt && <div>{formatRelativeTime(track.playedAt)}</div>}
        </>
      )}
      {showLocalPlaceholder && <div>♫ Last.fm status appears here on the deployed site.</div>}
    </div>
  );
}
