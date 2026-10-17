import type { APIRoute } from 'astro';
import { withBase } from '../lib/url';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(withBase('/sitemap-index.xml'), site).href;
  const bots = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', '*'];
  const body = bots.map((b) => `User-agent: ${b}\nAllow: /\n`).join('\n') + `\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
