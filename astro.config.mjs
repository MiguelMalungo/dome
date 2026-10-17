// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Live on GitHub Pages for now: https://miguelmalungo.github.io/dome/ (deploy: npm run deploy).
// TODO: once the real domain is registered, set SITE to it and BASE to '/'.
const SITE = 'https://miguelmalungo.github.io';
const BASE = '/dome';

export default defineConfig({
  site: SITE,
  base: BASE,
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'pt', locales: { pt: 'pt-PT', en: 'en' } },
      // Thank-you pages are noindex.
      filter: (page) => !/\/(obrigado|thanks)\/?$/.test(page),
    }),
  ],
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
