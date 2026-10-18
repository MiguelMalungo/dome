// All on-screen text, European Portuguese (pt) and English (en). Facts match the site:
// 105 structure triangles in 2 shapes (75 A + 30 B), covered by panels of the same shapes;
// 3 sizes, 4 covers, 3 services.
export type Lang = 'pt' | 'en';

const pt = {
  hookNumber: '105',
  hookWord: 'triângulos.',
  shapes: '2 formas.',
  countA: '75 × A',
  countB: '30 × B',
  framesLabel: 'Estrutura',
  panelsLabel: 'Revestimento',
  home: '1 casa.',
  heroEyebrow: 'Cúpulas geodésicas em madeira',
  tagline: 'Uma casa que se monta triângulo a triângulo.',
  kitTitle: 'Kit pré-cortado',
  kitText: 'Triângulos de estrutura, painéis, ligadores e manual ilustrado.',
  diy: 'Monte-a você…',
  weBuild: '…ou construímos nós.',
  sizesEyebrow: 'A mesma geometria',
  sizesTitle: '3 tamanhos',
  sizes: [
    { d: '4 m', area: '12,6 m²' },
    { d: '6 m', area: '28,3 m²' },
    { d: '8 m', area: '50,3 m²' },
  ],
  coversEyebrow: 'A mesma estrutura',
  coversTitle: '4 revestimentos',
  covers: ['OSB', 'Cortiça', 'Tecido técnico', 'Vidro'],
  interior: 'Por dentro, é casa.',
  servicesEyebrow: 'Como preferir',
  services: ['Kit para montar', 'Montagem assistida', 'Chave na mão'],
  brandLine: 'Cúpulas geodésicas em madeira',
  cta: 'Peça orçamento',
  site: 'domehome.pt',
};

const en: typeof pt = {
  hookNumber: '105',
  hookWord: 'triangles.',
  shapes: '2 shapes.',
  countA: '75 × A',
  countB: '30 × B',
  framesLabel: 'Structure',
  panelsLabel: 'Cover',
  home: '1 home.',
  heroEyebrow: 'Wooden geodesic domes',
  tagline: 'A home you build triangle by triangle.',
  kitTitle: 'Pre-cut kit',
  kitText: 'Structure triangles, panels, connectors and an illustrated manual.',
  diy: 'Build it yourself…',
  weBuild: '…or we build it for you.',
  sizesEyebrow: 'One geometry',
  sizesTitle: '3 sizes',
  sizes: [
    { d: '4 m', area: '12.6 m²' },
    { d: '6 m', area: '28.3 m²' },
    { d: '8 m', area: '50.3 m²' },
  ],
  coversEyebrow: 'One structure',
  coversTitle: '4 covers',
  covers: ['OSB', 'Cork', 'Technical fabric', 'Glass'],
  interior: 'Inside, it’s home.',
  servicesEyebrow: 'Your way',
  services: ['Self-build kit', 'Assisted build', 'Turnkey'],
  brandLine: 'Wooden geodesic domes',
  cta: 'Get a quote',
  site: 'domehome.pt',
};

export const copy = { pt, en };
export type Copy = typeof pt;
