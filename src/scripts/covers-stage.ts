// Covers: the same structure in four skins. Choosing a cover flips the dome's panels to it, triangle by
// triangle, in a wave from the top. Only in stage mode; otherwise the section stays a grid of cards.
export function initCoversStage() {
  const section = document.querySelector<HTMLElement>('[data-covers]');
  if (!section || !document.documentElement.classList.contains('stage')) return;
  const canvas = section.querySelector<HTMLCanvasElement>('.cover-canvas')!;
  const buttons = [...section.querySelectorAll<HTMLButtonElement>('button[data-cover]')];
  const cards = [...section.querySelectorAll<HTMLElement>('.cover[data-cover]')];
  type Skin = 'osb' | 'cork' | 'fabric' | 'glass' | 'mix';
  let viewer: import('../lib/dome/Viewer').Viewer | null = null;
  let current: Skin = 'osb';

  section.classList.add('is-live');
  section.querySelector('.mix-pick')?.removeAttribute('hidden');

  const select = (skin: Skin, animate = true) => {
    current = skin;
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.cover === skin));
    for (const c of cards) c.classList.toggle('is-active', c.dataset.cover === skin);
    viewer?.model.setSkin(skin, viewer.now(), animate);
  };
  for (const b of buttons) b.addEventListener('click', () => select(b.dataset.cover as Skin));
  // The whole card selects, not just its name.
  for (const c of cards)
    c.addEventListener('click', (e) => {
      if (!(e.target as Element).closest('button, a')) c.querySelector<HTMLButtonElement>('button[data-cover]')?.click();
    });
  select('osb', false);

  // Build the 3D stage only when the section comes near.
  const io = new IntersectionObserver(
    async ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      try {
        const { createViewer } = await import('../lib/dome/Viewer');
        viewer = createViewer({ canvas, framing: () => ({ x: 0.5, y: 0.56, fill: 0.84 }), autoRotate: 0.2 });
        viewer.model.setAssembly(1);
        viewer.model.setCladding(1);
        viewer.model.setSkin(current, viewer.now(), false);
        section.classList.add('is-ready');
      } catch (err) {
        console.error(err);
        section.classList.remove('is-live');
      }
    },
    { rootMargin: '400px 0px' },
  );
  io.observe(canvas);
}
