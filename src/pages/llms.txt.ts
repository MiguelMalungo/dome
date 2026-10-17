import type { APIRoute } from 'astro';
import { llms } from '../lib/llms';

export const GET: APIRoute = ({ site }) =>
  new Response(llms(site!, false), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
