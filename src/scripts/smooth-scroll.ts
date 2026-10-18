// Smooth wheel scrolling (Lenis) kept in step with GSAP ScrollTrigger, plus smooth in-page links.
import Lenis from 'lenis';
import type { gsap as Gsap } from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';

let lenis: Lenis | null = null;

export function startSmoothScroll(gsap: typeof Gsap, ScrollTrigger: typeof ST) {
  if (lenis || matchMedia('(prefers-reduced-motion: reduce)').matches) return lenis;
  lenis = new Lenis({ lerp: 0.11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || !lenis) return;
    const url = new URL(a.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: -80, duration: 1.3 });
    history.pushState(null, '', url.hash);
  });
  return lenis;
}
