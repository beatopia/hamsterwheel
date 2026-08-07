const SOUND_CACHE_VERSION = 'quiet-v1';

export function createAudio(src: string, volume = 0.35) {
  const audio = new Audio(`${src}?v=${SOUND_CACHE_VERSION}`);
  audio.preload = 'auto';
  audio.volume = volume;
  return audio;
}