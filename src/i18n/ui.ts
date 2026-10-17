// All site copy, in European Portuguese (pt) and English (en).
// Keep both languages in sync: every key must exist in both.

import { withBase } from '../lib/url';

export type Lang = 'pt' | 'en';

const pt = {
  meta: {
    title: 'D’OME — Domos geodésicos em madeira',
    description:
      'Kits de domos geodésicos em madeira para montar por si, triângulo a triângulo — ou chave na mão. Casas, estúdios e refúgios com menos material e menos impacto.',
  },
  nav: {
    how: 'Como funciona',
    models: 'Modelos',
    covers: 'Revestimentos',
    sustainability: 'Sustentabilidade',
    services: 'Construímos',
    faq: 'Perguntas',
    quote: 'Pedir orçamento',
    menu: 'Menu',
    switchLabel: 'English',
    skip: 'Saltar para o conteúdo',
  },
  hero: {
    eyebrow: 'Domos geodésicos em madeira',
    title: 'Uma casa que se monta triângulo a triângulo.',
    lead:
      'Desenhamos e cortamos kits de domos geodésicos em madeira, prontos a montar por si: painéis numerados, manual passo a passo e a nossa equipa sempre contactável. Prefere não pegar no berbequim? Também construímos por si.',
    ctaPrimary: 'Ver modelos',
    ctaSecondary: 'Pedir orçamento',
    tags: ['Kit para montar', 'Montagem assistida', 'Chave na mão'],
    alt: 'Domo geodésico em madeira com janelas triangulares',
  },
  facts: [
    { value: '105', label: 'painéis triangulares, em apenas 2 formatos' },
    { value: '≈ 22 %', label: 'menos parede e cobertura do que uma casa retangular com a mesma área e volume', note: '1' },
    { value: '≈ 1 t', label: 'de CO₂ guardada em cada metro cúbico de madeira', note: '2' },
    { value: '0 gruas', label: 'painéis montados à mão, com ferramentas comuns' },
  ],
  how: {
    eyebrow: 'Como funciona',
    title: 'Do kit ao domo, em quatro passos.',
    steps: [
      {
        title: 'Escolha o modelo',
        text: 'Três diâmetros (4, 6 e 8 m) e quatro revestimentos. Ajudamos a escolher de acordo com o terreno, o uso e o orçamento.',
      },
      {
        title: 'Receba o kit',
        text: 'Painéis triangulares em madeira, pré-cortados, numerados e agrupados por anel, com ligadores, parafusaria e manual ilustrado.',
      },
      {
        title: 'Prepare a base',
        text: 'Uma plataforma em madeira sobre sapatas ou estacas: menos betão e menos impacto no solo. Fazemos o projeto da base consigo.',
      },
      {
        title: 'Monte anel a anel',
        text: 'Do chão para o topo, cada anel trava o seguinte. O manual mostra o lugar de cada painel e estamos a um telefonema de distância.',
      },
    ],
    panelsTitle: 'Só dois formatos de triângulo',
    panelsText: 'A geometria 3V 5/8 usa 105 painéis de apenas dois tipos. Menos peças diferentes, menos enganos.',
    panelA: 'Painel A',
    panelB: 'Painel B',
    panelsNote: 'Medidas dos lados no D’OME 6.',
    buildAlt: 'Domo de painéis triangulares em madeira em montagem, sobre uma plataforma de madeira',
    kitAlt: 'Kit de painéis triangulares em madeira, empilhados na oficina com os ligadores metálicos',
  },
  models: {
    eyebrow: 'Modelos',
    title: 'Três tamanhos, a mesma geometria.',
    lead: 'Todos os domos D’OME usam a mesma geometria geodésica 3V 5/8: muito estável, com paredes que sobem quase na vertical antes de curvar.',
    diameter: 'Diâmetro',
    floor: 'Área de chão',
    height: 'Altura',
    items: {
      '4': { name: 'D’OME 4', use: 'Estúdio de jardim, escritório, quarto de glamping.' },
      '6': { name: 'D’OME 6', use: 'Cabana, casa de hóspedes, atelier.' },
      '8': { name: 'D’OME 8', use: 'Casa de família, com espaço para mezanino.' },
    },
    cta: 'Pedir orçamento',
    other: 'Precisa de outra medida? Fale connosco.',
    interiorAlt: 'Interior de um domo em madeira, com teto triangular e luz natural',
  },
  covers: {
    eyebrow: 'Revestimentos',
    title: 'A mesma estrutura, quatro peles.',
    lead: 'A estrutura em madeira é sempre a mesma. O revestimento decide como vai viver o seu domo.',
    items: [
      {
        id: 'osb',
        name: 'OSB',
        sub: 'Para viver todo o ano',
        text: 'Painéis OSB sobre a estrutura, isolamento em fibra de madeira, membrana respirável e acabamento exterior em shingle de madeira.',
        tags: ['Habitação permanente', 'Isolamento térmico'],
        alt: 'Domo revestido a OSB com acabamento em madeira e porta de entrada',
      },
      {
        id: 'cork',
        name: 'Cortiça',
        sub: 'Natural e isolante',
        text: 'Placas de aglomerado de cortiça expandida sobre a estrutura. Isolam o domo e ficam à vista como acabamento exterior.',
        tags: ['Habitação permanente', 'Isolamento natural'],
        alt: 'Domo revestido a placas de cortiça escura, com janelas triangulares',
      },
      {
        id: 'fabric',
        name: 'Tecido técnico',
        sub: 'Leve, rápido, sazonal',
        text: 'Membrana técnica tensionada sobre a estrutura de madeira. Montagem rápida, luz filtrada, ideal para glamping, eventos e verão.',
        tags: ['Montagem rápida', 'Glamping e eventos'],
        alt: 'Domo revestido a tecido técnico claro sobre estrutura de madeira',
      },
      {
        id: 'glass',
        name: 'Vidro',
        sub: 'Para ver o céu',
        text: 'Triângulos de vidro duplo em caixilho de madeira. Estufas, jardins de inverno e salas com o céu por teto.',
        tags: ['Luz natural', 'Estufa ou sala'],
        alt: 'Domo envidraçado com estrutura de madeira e plantas no interior',
      },
    ],
    mix: 'Pode combinar: um domo em OSB com alguns triângulos de vidro, por exemplo. Qualquer painel pode ser janela.',
  },
  sustainability: {
    eyebrow: 'Sustentabilidade',
    title: 'Construir leve, com um material que cresce.',
    points: [
      {
        title: 'A madeira guarda carbono',
        text: 'As árvores retiram CO₂ do ar e a madeira mantém-no armazenado durante toda a vida do edifício: cerca de uma tonelada por metro cúbico.',
        note: '2',
      },
      {
        title: 'A forma mais eficiente',
        text: 'A esfera encerra o maior volume com a menor superfície. Uma D’OME tem cerca de 22 % menos parede e cobertura expostas ao frio e ao calor do que uma casa retangular com a mesma área e volume.',
        note: '1',
      },
      {
        title: 'Pouco desperdício em obra',
        text: 'Os painéis chegam cortados à medida. No terreno quase não há sobras nem entulho.',
      },
      {
        title: 'Fundações leves',
        text: 'Uma plataforma de madeira sobre sapatas ou estacas usa muito menos betão e deixa o solo praticamente intacto.',
      },
      {
        title: 'Desmontável e reutilizável',
        text: 'As ligações são aparafusadas. O domo pode ser desmontado, mudado de sítio ou ampliado, e a madeira volta a ser útil.',
      },
      {
        title: 'Madeira de origem responsável',
        text: 'Trabalhamos com madeira de florestas geridas de forma sustentável, com certificação FSC® ou PEFC.',
      },
    ],
    sources: 'Fontes',
    footnotes: [
      'Cálculo D’OME: domo geodésico 3V 5/8 comparado com um volume retangular de planta quadrada com a mesma área de chão e o mesmo volume interior (paredes + cobertura).',
      'Deutschland.de, “Building with wood in Germany: 10 facts”.',
    ],
    sourceUrl: 'https://www.deutschland.de/en/topic/environment/building-with-wood-in-germany-10-facts',
  },
  services: {
    eyebrow: 'Construímos por si',
    title: 'Faça você, faça connosco, ou deixe connosco.',
    items: [
      {
        name: 'Kit D’OME',
        who: 'Para quem gosta de construir',
        text: 'Kit completo, manual ilustrado e apoio por telefone e videochamada durante toda a montagem.',
      },
      {
        name: 'Montagem assistida',
        who: 'Para construir acompanhado',
        text: 'Um montador D’OME trabalha com a sua equipa no terreno até a estrutura estar de pé e fechada.',
      },
      {
        name: 'Chave na mão',
        who: 'Para quem quer só as chaves',
        text: 'Tratamos de tudo: base, estrutura, revestimento, portas e janelas. Construímos por um valor fechado no orçamento.',
      },
    ],
    note: 'O preço depende do modelo, do revestimento e da localização. Peça um orçamento sem compromisso.',
  },
  faq: {
    eyebrow: 'Perguntas frequentes',
    title: 'Antes de começar.',
    items: [
      {
        q: 'Preciso de licença para construir um domo?',
        a: 'Depende do tamanho, do uso e do município. Uma habitação precisa, em regra, de licenciamento na câmara municipal; estruturas pequenas ou amovíveis podem ter regras mais simples. Ajudamos a preparar a documentação técnica para o seu processo.',
      },
      {
        q: 'Quanto tempo demora a montar?',
        a: 'Depende do modelo, do revestimento e de quantas pessoas ajudam. A estrutura sobe depressa; o revestimento e os acabamentos são o que leva mais tempo. No orçamento damos-lhe uma estimativa para o seu caso.',
      },
      {
        q: 'Que ferramentas são precisas?',
        a: 'Aparafusadora, escadote, um andaime simples para os anéis superiores, nível e equipamento de proteção. A lista completa vem no manual.',
      },
      {
        q: 'É confortável no inverno e no verão?',
        a: 'Com os revestimentos isolados, em OSB ou cortiça, sim: menos superfície exterior significa menos perdas de calor no inverno e menos ganhos no verão. O tecido técnico é pensado para uso sazonal.',
      },
      {
        q: 'Posso acrescentar janelas, portas ou combinar revestimentos?',
        a: 'Sim. Qualquer triângulo pode ser envidraçado e a entrada pode ser desenhada à medida.',
      },
      {
        q: 'Onde entregam?',
        a: 'Em Portugal continental. Para outros destinos, incluindo o resto da Europa, fale connosco.',
      },
    ],
  },
  quote: {
    eyebrow: 'Orçamento',
    title: 'Conte-nos o que imagina.',
    lead: 'Respondemos com uma proposta para o seu terreno e o seu projeto.',
    name: 'Nome',
    email: 'Email',
    phone: 'Telefone',
    location: 'Localização do terreno',
    locationHint: 'Concelho ou região',
    model: 'Modelo',
    cover: 'Revestimento',
    service: 'Serviço',
    message: 'Mensagem',
    messageHint: 'Para que vai usar o domo? Tem já terreno e prazo em mente?',
    unsure: 'Ainda não sei',
    mixed: 'Combinado',
    consent: 'Aceito que a D’OME use estes dados apenas para responder ao meu pedido.',
    submit: 'Enviar pedido',
    required: 'obrigatório',
    or: 'Ou escreva-nos para',
  },
  thanks: {
    title: 'Obrigado!',
    text: 'Recebemos o seu pedido e respondemos em breve.',
    back: 'Voltar ao início',
  },
  footer: {
    tagline: 'Domos geodésicos em madeira',
    rights: 'Todos os direitos reservados.',
  },
};

const en: typeof pt = {
  meta: {
    title: 'D’OME — Wooden geodesic domes',
    description:
      'Wooden geodesic dome kits you build yourself, triangle by triangle, or that we build for you. Homes, studios and retreats with less material and less impact.',
  },
  nav: {
    how: 'How it works',
    models: 'Models',
    covers: 'Covers',
    sustainability: 'Sustainability',
    services: 'We build',
    faq: 'FAQ',
    quote: 'Get a quote',
    menu: 'Menu',
    switchLabel: 'Português',
    skip: 'Skip to content',
  },
  hero: {
    eyebrow: 'Wooden geodesic domes',
    title: 'A home you build triangle by triangle.',
    lead:
      'We design and cut wooden geodesic dome kits that are ready for you to build: numbered panels, a step-by-step manual and our team on call. Rather not pick up the drill? We build it for you too.',
    ctaPrimary: 'See the models',
    ctaSecondary: 'Get a quote',
    tags: ['Self-build kit', 'Assisted build', 'Turnkey'],
    alt: 'Wooden geodesic dome with triangular windows',
  },
  facts: [
    { value: '105', label: 'triangular panels, in just 2 shapes' },
    { value: '≈ 22 %', label: 'less wall and roof than a box-shaped house with the same floor area and volume', note: '1' },
    { value: '≈ 1 t', label: 'of CO₂ stored in every cubic metre of wood', note: '2' },
    { value: '0 cranes', label: 'panels go up by hand, with ordinary tools' },
  ],
  how: {
    eyebrow: 'How it works',
    title: 'From kit to dome in four steps.',
    steps: [
      {
        title: 'Choose your model',
        text: 'Three diameters (4, 6 and 8 m) and four covers. We help you choose for your site, your use and your budget.',
      },
      {
        title: 'Receive the kit',
        text: 'Pre-cut wooden triangle panels, numbered and grouped by ring, with connectors, fixings and an illustrated manual.',
      },
      {
        title: 'Prepare the base',
        text: 'A timber platform on pad footings or ground screws: less concrete, less impact on the soil. We design the base with you.',
      },
      {
        title: 'Build ring by ring',
        text: 'From the ground up, each ring locks the next. The manual shows where every panel goes and we are a phone call away.',
      },
    ],
    panelsTitle: 'Just two triangle shapes',
    panelsText: 'The 3V 5/8 geometry uses 105 panels of only two types. Fewer different parts, fewer mistakes.',
    panelA: 'Panel A',
    panelB: 'Panel B',
    panelsNote: 'Side lengths for the D’OME 6.',
    buildAlt: 'Dome of wooden triangle panels being assembled on a timber platform',
    kitAlt: 'Kit of wooden triangle panels stacked in the workshop with the metal connectors',
  },
  models: {
    eyebrow: 'Models',
    title: 'Three sizes, one geometry.',
    lead: 'Every D’OME uses the same 3V 5/8 geodesic geometry: very stable, with walls that rise almost vertically before they curve.',
    diameter: 'Diameter',
    floor: 'Floor area',
    height: 'Height',
    items: {
      '4': { name: 'D’OME 4', use: 'Garden studio, home office, glamping room.' },
      '6': { name: 'D’OME 6', use: 'Cabin, guest house, workshop.' },
      '8': { name: 'D’OME 8', use: 'Family home, with room for a mezzanine.' },
    },
    cta: 'Get a quote',
    other: 'Need a different size? Talk to us.',
    interiorAlt: 'Interior of a wooden dome with a triangulated ceiling and daylight',
  },
  covers: {
    eyebrow: 'Covers',
    title: 'One structure, four skins.',
    lead: 'The timber frame is always the same. The cover decides how your dome will live.',
    items: [
      {
        id: 'osb',
        name: 'OSB',
        sub: 'For living all year',
        text: 'OSB panels over the frame, wood-fibre insulation, a breathable membrane and a wooden shingle finish outside.',
        tags: ['Permanent home', 'Insulated'],
        alt: 'Dome clad in OSB with a wooden finish and front door',
      },
      {
        id: 'cork',
        name: 'Cork',
        sub: 'Natural and insulating',
        text: 'Expanded cork agglomerate boards over the frame. They insulate the dome and stay exposed as the outside finish.',
        tags: ['Year-round living', 'Natural insulation'],
        alt: 'Dome clad in dark cork boards, with triangular windows',
      },
      {
        id: 'fabric',
        name: 'Technical fabric',
        sub: 'Light, quick, seasonal',
        text: 'A tensioned technical membrane over the timber frame. Quick to put up, softly lit, ideal for glamping, events and summer.',
        tags: ['Quick to build', 'Glamping and events'],
        alt: 'Dome covered in light technical fabric over a timber frame',
      },
      {
        id: 'glass',
        name: 'Glass',
        sub: 'To see the sky',
        text: 'Double-glazed triangles in timber frames. Greenhouses, winter gardens and living rooms with the sky as the ceiling.',
        tags: ['Daylight', 'Greenhouse or living room'],
        alt: 'Glazed dome with a timber frame and plants inside',
      },
    ],
    mix: 'You can combine them: an OSB dome with a few glass triangles, for example. Any panel can be a window.',
  },
  sustainability: {
    eyebrow: 'Sustainability',
    title: 'Build light, with a material that grows.',
    points: [
      {
        title: 'Wood stores carbon',
        text: 'Trees take CO₂ out of the air and the wood keeps it stored for the whole life of the building: around one tonne per cubic metre.',
        note: '2',
      },
      {
        title: 'The most efficient shape',
        text: 'A sphere encloses the most volume with the least surface. A D’OME has about 22 % less wall and roof exposed to cold and heat than a box-shaped house with the same floor area and volume.',
        note: '1',
      },
      {
        title: 'Little waste on site',
        text: 'Panels arrive cut to size. There are almost no offcuts or rubble on your land.',
      },
      {
        title: 'Light foundations',
        text: 'A timber platform on pad footings or ground screws uses far less concrete and leaves the soil almost untouched.',
      },
      {
        title: 'Take it apart, use it again',
        text: 'All joints are bolted. The dome can be taken down, moved or extended, and the wood stays useful.',
      },
      {
        title: 'Responsibly sourced timber',
        text: 'We work with timber from sustainably managed forests, certified FSC® or PEFC.',
      },
    ],
    sources: 'Sources',
    footnotes: [
      'D’OME calculation: 3V 5/8 geodesic dome compared with a square-plan box of the same floor area and interior volume (walls + roof).',
      'Deutschland.de, “Building with wood in Germany: 10 facts”.',
    ],
    sourceUrl: 'https://www.deutschland.de/en/topic/environment/building-with-wood-in-germany-10-facts',
  },
  services: {
    eyebrow: 'We build for you',
    title: 'Build it yourself, build it with us, or leave it to us.',
    items: [
      {
        name: 'D’OME kit',
        who: 'For people who like to build',
        text: 'The complete kit, an illustrated manual and phone and video support for the whole build.',
      },
      {
        name: 'Assisted build',
        who: 'For building with a guide',
        text: 'A D’OME builder works with your team on site until the structure is standing and closed.',
      },
      {
        name: 'Turnkey',
        who: 'For people who just want the keys',
        text: 'We handle everything: base, structure, cover, doors and windows, for a fixed price agreed in the quote.',
      },
    ],
    note: 'Price depends on the model, the cover and the location. Ask for a free, no-obligation quote.',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Before you start.',
    items: [
      {
        q: 'Do I need planning permission for a dome?',
        a: 'It depends on the size, the use and the municipality. A home generally needs a building permit from the local council; small or removable structures may have simpler rules. We help prepare the technical documents for your application.',
      },
      {
        q: 'How long does it take to build?',
        a: 'It depends on the model, the cover and how many people help. The frame goes up quickly; the cover and finishes take the most time. Your quote includes an estimate for your project.',
      },
      {
        q: 'Which tools do I need?',
        a: 'A drill-driver, a stepladder, simple scaffolding for the upper rings, a level and safety gear. The full list is in the manual.',
      },
      {
        q: 'Is it comfortable in winter and summer?',
        a: 'With the insulated covers, OSB or cork, yes: less outside surface means less heat lost in winter and less gained in summer. The technical fabric is designed for seasonal use.',
      },
      {
        q: 'Can I add windows and doors, or combine covers?',
        a: 'Yes. Any triangle can be glazed and the entrance can be designed to order.',
      },
      {
        q: 'Where do you deliver?',
        a: 'Mainland Portugal. For other destinations, including the rest of Europe, get in touch.',
      },
    ],
  },
  quote: {
    eyebrow: 'Quote',
    title: 'Tell us what you have in mind.',
    lead: 'We reply with a proposal for your site and your project.',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    location: 'Site location',
    locationHint: 'Town or region',
    model: 'Model',
    cover: 'Cover',
    service: 'Service',
    message: 'Message',
    messageHint: 'What will you use the dome for? Do you already have land and a timeline?',
    unsure: 'Not sure yet',
    mixed: 'Combined',
    consent: 'I agree that D’OME may use this information only to reply to my request.',
    submit: 'Send request',
    required: 'required',
    or: 'Or write to us at',
  },
  thanks: {
    title: 'Thank you!',
    text: 'We have received your request and will reply soon.',
    back: 'Back to the home page',
  },
  footer: {
    tagline: 'Wooden geodesic domes',
    rights: 'All rights reserved.',
  },
};

export const ui = { pt, en };
export const t = (lang: Lang) => ui[lang];
export const paths = {
  pt: { home: withBase('/'), thanks: withBase('/obrigado/') },
  en: { home: withBase('/en/'), thanks: withBase('/en/thanks/') },
} as const;
