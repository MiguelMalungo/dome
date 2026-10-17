// Prefixes a root-relative path with the site's base path (astro.config.mjs `base`),
// so links and assets work both at a domain root and under /dome/ on GitHub Pages.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBase = (path: string) => `${base}${path}`;
