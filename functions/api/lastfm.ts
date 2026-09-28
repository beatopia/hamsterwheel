interface Env {
  LASTFM_USERNAME?: string;
  LASTFM_API_KEY?: string;
}

interface LastFmContext {
  env: Env;
}

interface LastFmApiTrack {
  name?: string;
  url?: string;
  artist?: { '#text'?: string; url?: string };
  date?: { uts?: string };
  '@attr'?: { nowplaying?: string };
}

export async function onRequestGet({ env }: LastFmContext): Promise<Response> {
  if (!env.LASTFM_USERNAME || !env.LASTFM_API_KEY) {
    return new Response('Last.fm is not configured', { status: 503 });
  }

  const params = new URLSearchParams({
    method: 'user.getrecenttracks',
    user: env.LASTFM_USERNAME,
    api_key: env.LASTFM_API_KEY,
    format: 'json',
    limit: '1',
  });

  try {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`);
    if (!response.ok) return new Response('Last.fm request failed', { status: 502 });

    const payload = await response.json() as {
      recenttracks?: { track?: LastFmApiTrack | LastFmApiTrack[] };
      error?: number;
    };
    if (payload.error) return new Response('Last.fm request failed', { status: 502 });

    const result = payload.recenttracks?.track;
    const latest = Array.isArray(result) ? result[0] : result;
    if (!latest?.name || !latest.artist?.['#text']) {
      return new Response('No recent track', { status: 404 });
    }

    const track = {
      title: latest.name,
      artist: latest.artist['#text'],
      trackUrl: latest.url || undefined,
      artistUrl: latest.artist.url || undefined,
      nowPlaying: latest['@attr']?.nowplaying === 'true',
      playedAt: latest.date?.uts ? Number(latest.date.uts) : undefined,
    };

    return Response.json(track, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return new Response('Last.fm request failed', { status: 502 });
  }
}
