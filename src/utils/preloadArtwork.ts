const artworkUrls = [
  '/media/images/catbatinvert.png',
  '/media/images/hamster/body1.png',
  '/media/images/hamster/legs1.png',
  '/media/images/hamster/legs2.png',
  '/media/images/hamster/legs3.png',
  '/media/images/hamster/legs4.png',
  '/media/images/hamster/legs5.png',
  '/media/images/hamster/legs6.png',
];

const decodedArtwork = new Map<string, { image: HTMLImageElement; ready: boolean; decoded: Promise<void> }>();

export function preloadArtwork() {
  for (const url of artworkUrls) {
    if (decodedArtwork.has(url)) continue;
    const image = new Image();
    image.decoding = 'async';
    image.loading = 'eager';
    image.src = url;
    const entry = { image, ready: false, decoded: Promise.resolve() };
    entry.decoded = image.decode().then(() => {
      entry.ready = true;
    }).catch(() => undefined);
    decodedArtwork.set(url, entry);
  }
}

export function areArtworkDecoded(urls: string[]) {
  return urls.every((url) => {
    const artwork = decodedArtwork.get(url);
    return artwork?.ready === true || Boolean(artwork?.image.complete && artwork.image.naturalWidth > 0);
  });
}

export function waitForArtwork(urls: string[]) {
  return Promise.all(urls.map((url) => decodedArtwork.get(url)?.decoded ?? Promise.resolve()));
}
