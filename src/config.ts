// Business details shown on the site. Empty values are hidden automatically.
// TODO: fill these in before launch.
export const business = {
  name: 'D’OME',
  email: 'domehomept@gmail.com',
  phone: '', // e.g. +351 9xx xxx xxx
  instagram: '', // full URL
  // Quote form endpoint. FormSubmit (formsubmit.co) relays posts to email on static hosting.
  // Leave empty to fall back to Netlify Forms.
  formAction: 'https://formsubmit.co/domehomept@gmail.com',
  formCc: 'miguelferrazguedes@mail.grokbot.com',
  formSubject: 'Novo pedido de orçamento — domehome.pt',
};

// Dome geometry used for the specs on the site (3V 5/8 geodesic dome).
// Numbers come from scripts/illustrations/render.py + the calculation in docs/business-brief.md.
export const models = [
  { id: '4', diameter: 4, floor: 12.6, height: 2.4 },
  { id: '6', diameter: 6, floor: 28.3, height: 3.6 },
  { id: '8', diameter: 8, floor: 50.3, height: 4.8 },
] as const;
