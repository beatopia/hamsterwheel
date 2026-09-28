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

const decodedArtwork = new Map<string, HTMLImageElement>();

export function preloadArtwork() {
  for (const url of artworkUrls) {
    if (decodedArtwork.has(url)) continue;
    const image = new Image();
    image.decoding = 'async';
    image.loading = 'eager';
    image.src = url;
    decodedArtwork.set(url, image);
    void image.decode().catch(() => undefined);
  }
}
