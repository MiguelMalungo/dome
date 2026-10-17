// Plain-text summaries for AI crawlers (llms.txt), generated from the site copy only.
import { business, models } from '../config';
import { t, paths, type Lang } from '../i18n/ui';

function section(lang: Lang, site: URL, full: boolean) {
  const c = t(lang);
  const L: string[] = [];
  L.push(`## ${lang === 'pt' ? 'Português' : 'English'} — ${new URL(paths[lang].home, site).href}`, '');
  L.push(c.meta.description, '');
  L.push(`### ${c.models.eyebrow}`, c.models.lead);
  for (const m of models) {
    const i = c.models.items[m.id];
    L.push(`- ${i.name}: ${c.models.diameter} ${m.diameter} m, ${c.models.floor} ${m.floor} m², ${c.models.height} ${m.height} m. ${i.use}`);
  }
  L.push('', ...c.facts.map((f) => `- ${f.value} ${f.label}`), '');
  L.push(`### ${c.covers.eyebrow}`, ...c.covers.items.map((i) => `- ${i.name} (${i.sub}): ${i.text}`), '');
  L.push(`### ${c.services.eyebrow}`, ...c.services.items.map((i) => `- ${i.name}: ${i.text}`), c.services.note, '');
  if (full) {
    L.push(`### ${c.how.eyebrow}`, ...c.how.steps.map((s) => `- ${s.title}: ${s.text}`), c.how.panelsText, '');
    L.push(`### ${c.sustainability.eyebrow}`, ...c.sustainability.points.map((p) => `- ${p.title}: ${p.text}`), '');
    L.push(`### ${c.faq.eyebrow}`);
    for (const i of c.faq.items) L.push(`Q: ${i.q}`, `A: ${i.a}`, '');
  }
  return L.join('\n');
}

export function llms(site: URL, full: boolean) {
  const head = [
    `# ${business.name}`,
    '',
    `> ${t('pt').footer.tagline} / ${t('en').footer.tagline}`,
    '',
    `Email: ${business.email}`,
    '',
    '',
  ].join('\n');
  return head + section('pt', site, full) + '\n\n' + section('en', site, full) + '\n';
}
