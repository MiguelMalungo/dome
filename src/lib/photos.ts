import type { ImageMetadata } from 'astro';

// Photos live in src/assets/photos/<name>.(jpg|jpeg|png|webp|avif). See docs/images.md for the list.
const photos = import.meta.glob<{ default: ImageMetadata }>('/src/assets/photos/*.{jpg,jpeg,png,webp,avif}', { eager: true });

export function getPhoto(name: string): ImageMetadata | undefined {
  const match = Object.entries(photos).find(([path]) => path.split('/').pop()?.replace(/\.[^.]+$/, '') === name);
  return match?.[1].default;
}
