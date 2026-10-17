// Business details shown on the site. Empty values are hidden automatically.
// TODO: fill these in before launch.
export const business = {
  name: 'D’OME',
  email: '', // e.g. ola@your-domain.pt
  phone: '', // e.g. +351 9xx xxx xxx
  instagram: '', // full URL
  // Netlify Forms handles the quote form when the site is hosted on Netlify.
  // To use another service (Formspree, Basin…), put its endpoint here.
  formAction: '',
};

// Dome geometry used for the specs on the site (3V 5/8 geodesic dome).
// Numbers come from scripts/illustrations/render.py + the calculation in docs/business-brief.md.
export const models = [
  { id: '4', diameter: 4, floor: 12.6, height: 2.4 },
  { id: '6', diameter: 6, floor: 28.3, height: 3.6 },
  { id: '8', diameter: 8, floor: 50.3, height: 4.8 },
] as const;
