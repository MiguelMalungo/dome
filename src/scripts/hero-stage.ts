// The hero as a stage: the 105 structure triangles assemble the dome ring by ring while the headline
// widens letter by letter (Archivo's width axis). Scrolling clads the structure with panels, then an
// ochre triangle opens onto the real photo: first the structure, then the home.
// Only runs when <html> has .stage (set in Base.astro: WebGL 2, no reduced motion, no data saver);
// otherwise, or if anything fails, the hero stays the plain photo hero.
export async function initHeroStage() {
  const root = document.documentElement;
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero || !root.classList.contains('stage')) return;
  const fallback = (err?: unknown) => {
    if (err) console.error(err);
    root.classList.remove('stage', 'stage-ready');
  };

  let gsap: typeof import('gsap').gsap;
  let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
  let SplitText: typeof import('gsap/SplitText').SplitText;
  try {
    [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText')]);
  } catch (err) {
    return fallback(err);
  }
  gsap.registerPlugin(ScrollTrigger, SplitText);
  root.classList.add('stage-ready');
  (await import('./smooth-scroll')).startSmoothScroll(gsap, ScrollTrigger);

  // Headline: letters widen from condensed to the heading width as they arrive.
  const h1 = hero.querySelector<HTMLElement>('h1')!;
  const rest = hero.querySelectorAll<HTMLElement>('.hero-copy > :not(h1)');
  gsap.set([h1, ...rest], { visibility: 'visible' });
  const split = SplitText.create(h1, { type: 'lines,chars', linesClass: 'hero-line' });
  gsap.fromTo(
    split.chars,
    { fontVariationSettings: "'wdth' 62", opacity: 0, yPercent: 35 },
    {
      fontVariationSettings: "'wdth' 112",
      opacity: 1,
      yPercent: 0,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.026,
      delay: 0.15,
      onComplete: () => split.revert(),
    },
  );
  gsap.from(rest, { opacity: 0, y: 18, duration: 0.9, ease: 'power2.out', stagger: 0.08, delay: 0.9 });

  // The dome.
  const canvas = hero.querySelector<HTMLCanvasElement>('.hero-canvas')!;
  const tip = hero.querySelector<HTMLElement>('.dome-tip')!;
  const hint = hero.querySelector<HTMLElement>('.hero-hint');
  const labels = hero.dataset;
  let viewer: import('../lib/dome/Viewer').Viewer;
  try {
    const { createViewer } = await import('../lib/dome/Viewer');
    viewer = createViewer({
      canvas,
      // Wide screens: centre the dome in the space right of the copy. Narrow: above the copy.
      framing: (w) => {
        if (w < 900) return { x: 0.5, y: 0.23, fill: 0.68 };
        const copy = hero.querySelector('.hero-copy')!.getBoundingClientRect();
        const right = copy.right - hero.getBoundingClientRect().left + 24;
        const free = Math.max(w - right, w * 0.3);
        return { x: (right + free * 0.47) / w, y: 0.55, fill: Math.min(0.5, (free * 0.84) / w) };
      },
      autoRotate: 0.12,
      onDrag: () => hint?.classList.add('is-done'),
      onHover: (piece, x, y) => {
        if (!piece) return tip.classList.remove('is-on');
        tip.querySelector('strong')!.textContent = piece.type === 'A' ? labels.labelA! : labels.labelB!;
        tip.querySelector('span')!.textContent = piece.type === 'A' ? labels.tipA! : labels.tipB!;
        tip.style.transform = `translate(${Math.round(x + 18)}px, ${Math.round(y + 18)}px)`;
        tip.classList.add('is-on');
      },
    });
  } catch (err) {
    return fallback(err);
  }
  const { model } = viewer;
  if (import.meta.env.DEV) (window as unknown as { __hero: unknown }).__hero = viewer;
  const st = { a: 0, c: 0 };
  const apply = () => {
    model.setAssembly(st.a);
    model.setCladding(st.c);
  };
  apply();
  hero.classList.add('is-live');
  gsap.to(st, { a: 1, duration: 3.1, ease: 'none', delay: 0.2, onUpdate: apply });

  // Scroll: clad the structure, then open a triangle onto the photo.
  const photo = hero.querySelector<HTMLElement>('.hero-bg');
  const edge = hero.querySelector<HTMLElement>('.hero-edge');
  const reveal = { p: 0 };
  const tri = (cx: number, cy: number, r: number) =>
    `polygon(${cx}px ${cy - r}px, ${cx + r * 0.866}px ${cy + r * 0.5}px, ${cx - r * 0.866}px ${cy + r * 0.5}px)`;
  const setClip = () => {
    if (!photo) return;
    const c = viewer.project(0, 0.55, 0);
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    const far = Math.hypot(Math.max(c.x, w - c.x), Math.max(c.y, h - c.y));
    const r = reveal.p * far * 2.05;
    photo.style.clipPath = tri(c.x, c.y, r);
    if (edge) edge.style.clipPath = tri(c.x, c.y, r > 0 ? r * 1.06 + 28 : 0);
    viewer.setPaused(reveal.p >= 0.999);
  };
  setClip();

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * 1.3)}`,
      pin: true,
      scrub: 0.7,
      invalidateOnRefresh: true,
    },
  });
  const focus = { f: 0 };
  tl.to(st, { c: 1, duration: 0.5, onUpdate: apply }, 0)
    .to(focus, { f: 1, duration: 0.5, ease: 'power1.inOut', onUpdate: () => viewer.setFocus(focus.f) }, 0.05)
    .to(hint, { autoAlpha: 0, duration: 0.1 }, 0.25)
    .to(hero.querySelector('.hero-grid'), { autoAlpha: 0, y: -60, duration: 0.2 }, 0.32);
  if (photo) {
    tl.to(reveal, { p: 1, duration: 0.42, ease: 'power2.in', onUpdate: setClip }, 0.52)
      .fromTo(photo.querySelector('img'), { scale: 1.18 }, { scale: 1, duration: 0.46 }, 0.52)
      .fromTo(hero.querySelector('.hero-statement'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.84);
  }

  // The header sits on the stage (transparent) until the hero has scrolled away.
  const header = document.querySelector<HTMLElement>('.site-header');
  const syncHeader = () => header?.classList.toggle('is-over', hero.getBoundingClientRect().bottom > (header?.offsetHeight ?? 0) + 4);
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: syncHeader, onRefresh: syncHeader });
  syncHeader();
}
