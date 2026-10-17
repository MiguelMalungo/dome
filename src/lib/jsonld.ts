// Structured data (schema.org JSON-LD) built only from the site copy and src/config.ts.
import { business, models } from '../config';
import { t, paths, type Lang } from '../i18n/ui';
import { withBase } from './url';

export function jsonLd(lang: Lang, site: URL) {
  const c = t(lang);
  const home = new URL(paths[lang].home, site).href;
  const orgId = new URL(withBase('/#organization'), site).href;
  const org = {
    '@type': 'Organization',
    '@id': orgId,
    name: "D'OME",
    alternateName: business.name,
    url: new URL(withBase('/'), site).href,
    email: business.email,
    logo: new URL(withBase('/apple-touch-icon.png'), site).href,
    areaServed: { '@type': 'Place', name: lang === 'pt' ? 'Portugal continental' : 'Mainland Portugal' },
    description: c.meta.description,
  };
  const products = models.map((m) => ({
    '@type': 'Product',
    name: c.models.items[m.id].name,
    description: c.models.items[m.id].use,
    brand: { '@id': orgId },
    url: home,
    additionalProperty: [
      { '@type': 'PropertyValue', name: c.models.diameter, value: m.diameter, unitCode: 'MTR' },
      { '@type': 'PropertyValue', name: c.models.floor, value: m.floor, unitCode: 'MTK' },
      { '@type': 'PropertyValue', name: c.models.height, value: m.height, unitCode: 'MTR' },
      { '@type': 'PropertyValue', name: lang === 'pt' ? 'Geometria' : 'Geometry', value: '3V 5/8' },
      { '@type': 'PropertyValue', name: lang === 'pt' ? 'Painéis triangulares' : 'Triangular panels', value: 105 },
    ],
  }));
  const faq = {
    '@type': 'FAQPage',
    inLanguage: lang === 'pt' ? 'pt-PT' : 'en',
    mainEntity: c.faq.items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
  return { '@context': 'https://schema.org', '@graph': [org, ...products, faq] };
}
