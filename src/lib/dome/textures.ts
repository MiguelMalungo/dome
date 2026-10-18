// Procedural canvas textures for the 3D dome, in the palette of the code-drawn illustrations.
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

function make(size: number, draw: (g: CanvasRenderingContext2D, s: number, rnd: () => number) => void, repeat: number) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const g = canvas.getContext('2d')!;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  draw(g, size, rnd);
  const t = new CanvasTexture(canvas);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 4;
  return t;
}
const pick = <T,>(a: T[], r: number) => a[Math.floor(r * a.length)];

// Light pine for the structure triangles: long grain lines.
export const pine = () =>
  make(
    512,
    (g, s, rnd) => {
      g.fillStyle = '#c99a66';
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < 90; i++) {
        const y = rnd() * s;
        g.strokeStyle = pick(['rgba(150,104,58,0.35)', 'rgba(222,184,138,0.45)', 'rgba(120,80,44,0.22)'], rnd());
        g.lineWidth = 0.6 + rnd() * 2.4;
        g.beginPath();
        g.moveTo(0, y);
        for (let x = 0; x <= s; x += 32) g.lineTo(x, y + Math.sin(x / 70 + i) * 3 * rnd());
        g.stroke();
      }
    },
    3,
  );

// Cedar shingles in staggered rows (the OSB cover's outside finish): weathered, uneven, low contrast.
export const shingles = () =>
  make(
    512,
    (g, s, rnd) => {
      g.fillStyle = '#4a3020';
      g.fillRect(0, 0, s, s);
      const rows = 12;
      const h = s / rows;
      for (let r = 0; r < rows; r++) {
        let x = -rnd() * 40;
        while (x < s) {
          const w = 22 + rnd() * 34;
          const y = r * h + (rnd() - 0.5) * 2;
          g.fillStyle = pick(['#a5683a', '#9a5f33', '#ad7242', '#8f5a32', '#b47a49', '#9d6639'], rnd());
          g.fillRect(x + 1, y, w - 2, h - 1.5);
          g.fillStyle = 'rgba(30,18,10,0.28)';
          g.fillRect(x + 1, y + h - 6, w - 2, 4.5);
          g.fillStyle = 'rgba(255,225,180,0.07)';
          for (let k = 0; k < 3; k++) g.fillRect(x + 2 + rnd() * (w - 6), y + 2, 1, h - 9);
          x += w;
        }
      }
    },
    7,
  );

// Expanded cork agglomerate: dark brown, coarse granules.
export const cork = () =>
  make(
    512,
    (g, s, rnd) => {
      g.fillStyle = '#5e3f25';
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < 3600; i++) {
        g.fillStyle = pick(['#4a3020', '#6e4a2c', '#7a5534', '#3e281a', '#8a6440', '#2f1f14'], rnd());
        g.beginPath();
        g.arc(rnd() * s, rnd() * s, 1 + rnd() * 4.5, 0, Math.PI * 2);
        g.fill();
      }
    },
    4,
  );

// Technical fabric: off-white with a faint weave.
export const fabric = () =>
  make(
    256,
    (g, s, rnd) => {
      g.fillStyle = '#efebe1';
      g.fillRect(0, 0, s, s);
      g.fillStyle = 'rgba(120,110,90,0.06)';
      for (let i = 0; i < s; i += 4) {
        g.fillRect(i, 0, 1, s);
        g.fillRect(0, i, s, 1);
      }
      for (let i = 0; i < 900; i++) {
        g.fillStyle = rnd() > 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(110,100,80,0.05)';
        g.fillRect(rnd() * s, rnd() * s, 2, 2);
      }
    },
    6,
  );

// Timber deck the dome stands on: radial-ish planks seen from above.
export const deck = () =>
  make(
    512,
    (g, s, rnd) => {
      for (let i = 0; i < 16; i++) {
        g.fillStyle = pick(['#8a5a33', '#9c6a3e', '#7d5130', '#a5733f'], rnd());
        g.fillRect(0, (i * s) / 16, s, s / 16 - 2);
      }
      g.fillStyle = 'rgba(30,18,10,0.6)';
      for (let i = 0; i < 16; i++) g.fillRect(0, (i * s) / 16 - 2, s, 2);
    },
    2,
  );

// Soft contact shadow under the deck.
export const shadow = () => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const g = canvas.getContext('2d')!;
  const grad = g.createRadialGradient(128, 128, 30, 128, 128, 128);
  grad.addColorStop(0, 'rgba(8,16,12,0.55)');
  grad.addColorStop(1, 'rgba(8,16,12,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return new CanvasTexture(canvas);
};
