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

function formatRelativeTime(timestamp: number) {
  const seconds = Math.round(timestamp - Date.now() / 1000);
  if (Math.abs(seconds) < 60) return RELATIVE_TIME.format(0, 'second');
  if (Math.abs(seconds) < 3600) return RELATIVE_TIME.format(Math.round(seconds / 60), 'minute');
  if (Math.abs(seconds) < 86400) return RELATIVE_TIME.format(Math.round(seconds / 3600), 'hour');
  return RELATIVE_TIME.format(Math.round(seconds / 86400), 'day');
}

export default function LastFmStatus() {
  const [track, setTrack] = React.useState<LastFmTrack | null>(null);

  React.useEffect(() => {
    let active = true;

    async function refresh() {
      try {
        const response = await fetch('/api/lastfm');
        if (!response.ok) return;
        const latest = await response.json() as LastFmTrack;
        if (active && latest.title && latest.artist) setTrack(latest);
      } catch {
        // Last.fm is optional; keep the status line empty if the request fails.
      }
    }

    void refresh();
    const timer = window.setInterval(() => void refresh(), REFRESH_INTERVAL);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="lastfm-status" aria-live="polite" aria-atomic="true">
      {track && (
        <>
          <div>
            <span aria-hidden="true">♫ </span>{track.nowPlaying ? 'Now playing: ' : 'Last played: '}
            {track.trackUrl ? <a href={track.trackUrl} target="_blank" rel="noopener noreferrer">{track.title}</a> : track.title}
            {' — '}
            {track.artistUrl ? <a href={track.artistUrl} target="_blank" rel="noopener noreferrer">{track.artist}</a> : track.artist}
          </div>
          {!track.nowPlaying && track.playedAt && <div>{formatRelativeTime(track.playedAt)}</div>}
        </>
      )}
    </div>
  );
}
