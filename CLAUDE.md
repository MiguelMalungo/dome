# D’OME website

Marketing site for **D’OME**, a business selling wooden geodesic dome kits (DIY) with an optional build-for-a-fee service. The kit's structure is 105 easy-to-assemble wooden triangle frames (2 shapes: 75 A + 30 B) that bolt together; cover panels of the same shapes go on top. Say "triângulos de estrutura" for the frames and "painéis" only for the cover. Covers: OSB, cork, technical fabric, glass. Sustainability is a core message. Business context: `docs/business-brief.md`.

## Stack

- Astro 7 static site, no UI framework. Node ≥ 22.22.
- `npm run dev` (http://localhost:4321) · `npm run build` → `dist/` · `npm run preview` · `npm run photos` (Higgsfield)
- System Node is 20; use Homebrew's `node@22` (`/opt/homebrew/opt/node@22/bin`).
- The project lives in `~/Developer/dome`, outside iCloud Drive (iCloud corrupted `node_modules`). Don't move it back.
- Fonts: `@fontsource-variable/archivo` (width + weight axes), self-hosted.
- Quote form: FormSubmit (`business.formAction` in `src/config.ts` → formsubmit.co, CC + subject there too). Empty `formAction` falls back to Netlify Forms (`data-netlify`).
- Hosting: GitHub Pages at https://miguelmalungo.github.io/dome/ (`npm run deploy` → `gh-pages` branch). Served under `base: '/dome'`: build every internal link or `public/` asset URL with `withBase()` (`src/lib/url.ts`) or `paths` (`src/i18n/ui.ts`), never a bare `/…`.
- `docs/business-brief.md` is internal: kept out of the public repo via `.git/info/exclude`.

## Languages

- Portuguese (pt-PT, European Portuguese) is the default at `/`; English at `/en/`.
- **All copy lives in `src/i18n/ui.ts`.** Never hard-code text in components. Every key must exist in both `pt` and `en` (the `en` object is typed from `pt`).
- Use European Portuguese spelling and vocabulary (equipa, telemóvel, contacto, registo…), never Brazilian.

## Structure

- `src/components/HomePage.astro`: the one-page home, sections in order: Hero (+ facts), HowItWorks, Models, Covers, Sustainability, Services, Faq, QuoteForm.
- Section anchors are Portuguese in both languages: `#como-funciona #modelos #revestimentos #sustentabilidade #construimos #perguntas #orcamento`.
- `src/config.ts`: contact details (empty = hidden) and model specs.
- `src/components/Logo.astro`: the D’OME wordmark as inline SVG (`lattice` | `solid`), coloured by `currentColor`.
- `src/components/Visual.astro` + `src/lib/photos.ts`: shows `src/assets/photos/<name>.(jpg|png|webp|avif)` if it exists, otherwise the illustration. Photo list: `docs/images.md`.
- `scripts/photos/higgsfield.mjs`: the photo prompts; generates them via the Higgsfield API (keys in `.env`). Edit prompts there, not in the docs.
- `src/illustrations/*.svg`: dome drawings generated from real 3V 5/8 geometry by `python3 scripts/illustrations/render.py` (pure Python). Don't hand-edit them; change the script and re-run.
- `brand/`: logo files (SVG + PNG) for use outside the site.
- 3D + motion (progressive enhancement): `Base.astro` adds `html.stage` only with WebGL 2, no reduced motion and no data saver; without it the site is the plain photo/card version. `src/lib/dome/` builds the dome in three.js from the same 3V 5/8 geometry (`geometry.ts`, 105 faces: 75 A + 30 B), one timber frame + one cover panel per face (`DomeModel.ts`), and a stage with drag/hover (`Viewer.ts`). `src/scripts/hero-stage.ts`: load sequence (frames assemble, headline widens on Archivo's `wdth` axis) and the pinned scroll (cladding → triangle reveal of the hero photo). `src/scripts/covers-stage.ts`: choosing a cover flips the panels. GSAP (ScrollTrigger, SplitText), Lenis and three.js are dynamic imports. Keep motion to these moments: no generic fade-ins on every section.
- `video/`: separate Remotion project (own `package.json`) for the 9:16 Reels/TikTok promo, PT + EN. Copy in `video/src/copy.ts` (same rules: European Portuguese, no invented numbers). Every scene starts on a bar of the beat map in `video/src/timeline.ts`; keep cuts on the grid (`bar(n)`; 90.75 BPM, so a beat is 19.83 frames; video starts on the downbeat at 0:31.8, big drop at `bar(4)`, break and end card from `bar(12)`). Text stays inside `SAFE` (Reels/TikTok UI).

## Brand

- Colours: pine `#1E3D34` (ink), paper `#F2F3EF`, ochre accent `#D49A2A` (decorative only; use `#85570C` for ochre text on light backgrounds), wood `#C99A66`, wood dark `#5E3F25`. Tokens in `src/styles/global.css`.
- Type: Archivo Variable; headings at `font-stretch: 112–115%`, weight 800.
- Motif: the ochre triangle (the logo’s apostrophe) for eyebrows, bullets and step numbers.
- The logo’s D is the dome seen from the side, the O is the dome seen from above. Don’t redraw it with a font.

## Content rules

- Don’t invent numbers. Specs come from the geometry (see the brief). Sustainability claims must keep their footnoted source.
- The FSC/PEFC line and the delivery area are unconfirmed: check `docs/business-brief.md` before changing them.

## Open TODOs

- [ ] Real domain in `astro.config.mjs` (`SITE`, and `BASE` back to `'/'`) — currently GitHub Pages.
- [ ] Email / phone / Instagram in `src/config.ts`.
- [ ] Privacy policy page (the form collects personal data — GDPR).
- [ ] Quote form: doesn't work on GitHub Pages (405). Set `business.formAction` to a form service, or move hosting to Netlify, then test end to end.
