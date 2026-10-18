import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from './brand';
import { FONT } from './fonts';
import { LOGO } from './logo-paths';
import { FPB, HEIGHT, SAFE, WIDTH } from './timeline';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Short zoom "punch" on every kick. Scenes start on a bar, so local frame 0 is a beat.
export const kick = (frame: number, amount = 0.018) => amount * Math.exp(-(frame % FPB) / 3.5);

export const headline: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 800,
  fontStretch: '115%',
  letterSpacing: '-0.01em',
  lineHeight: 1.02,
  margin: 0,
};

// Full-bleed photo with a slow push-in (Ken Burns) and a small pulse on the beat.
export const Photo: React.FC<{
  src: string;
  duration: number;
  zoom?: [number, number];
  drift?: [number, number]; // vertical drift in px over the scene
  position?: string;
  pulse?: boolean;
}> = ({ src, duration, zoom = [1.04, 1.14], drift = [0, 0], position = 'center', pulse = true }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, duration], [0, 1], clamp);
  const scale = interpolate(t, [0, 1], zoom) + (pulse ? kick(frame) : 0);
  const y = interpolate(t, [0, 1], drift);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: C.pineDeep }}>
      <Img
        src={src}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, transform: `translateY(${y}px) scale(${scale})` }}
      />
    </AbsoluteFill>
  );
};

// Darkens the top of a photo so white titles stay readable.
export const Shade: React.FC<{ strength?: number; reach?: number }> = ({ strength = 0.78, reach = 50 }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(14,30,24,${strength}) 0%, rgba(14,30,24,${strength * 0.5}) ${reach * 0.55}%, rgba(14,30,24,0) ${reach}%), linear-gradient(0deg, rgba(14,30,24,0.35) 0%, rgba(14,30,24,0) 22%)`,
    }}
  />
);

// Text that rises word by word out of a mask.
export const Words: React.FC<{
  text: string;
  start?: number;
  stagger?: number;
  size: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ text, start = 0, stagger = 3, size, color = C.white, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <p style={{ ...headline, fontSize: size, color, ...style }}>
      {text.split(' ').map((word, i) => {
        const p = spring({ frame: frame - start - i * stagger, fps, config: { damping: 200, stiffness: 220 } });
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.1em', marginBottom: '-0.1em', verticalAlign: 'top' }}>
            <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 105}%)` }}>
              {word}
              {i < text.split(' ').length - 1 ? ' ' : ''}
            </span>
          </span>
        );
      })}
    </p>
  );
};

// The brand's ochre triangle, used as a bullet and eyebrow marker.
export const Tri: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({ size, color = C.ochre, style }) => (
  <svg width={size} height={size * 0.88} viewBox="0 0 100 88" style={style}>
    <path d="M0 0H100L50 88Z" fill={color} />
  </svg>
);

export const Eyebrow: React.FC<{ text: string; start?: number; color?: string; size?: number }> = ({ text, start = 0, color = C.ochre, size = 34 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - start, [0, 8], [0, 1], clamp);
  const x = interpolate(frame - start, [0, 10], [-24, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: o, transform: `translateX(${x}px)` }}>
      <Tri size={size * 0.8} color={C.ochre} />
      <span style={{ fontFamily: FONT, fontWeight: 650, fontSize: size, letterSpacing: '0.16em', textTransform: 'uppercase', color }}>{text}</span>
    </div>
  );
};

// Pops a child in with a spring (scale + fade).
export const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({ at, children, style, from = 0.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });
  return <div style={{ ...style, opacity: Math.min(1, p * 1.6), transform: `scale(${from + (1 - from) * p})` }}>{children}</div>;
};

export const Title: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = SAFE.top + 40 }) => (
  <div style={{ position: 'absolute', left: SAFE.left, right: SAFE.left, top, display: 'grid', gap: 28 }}>{children}</div>
);

// Reveals the scene through a growing triangle with an ochre edge, the logo's apostrophe motif.
const triangle = (cx: number, cy: number, r: number) =>
  `polygon(${cx}px ${cy - r}px, ${cx + r * 0.866}px ${cy + r * 0.5}px, ${cx - r * 0.866}px ${cy + r * 0.5}px)`;

export const TriangleReveal: React.FC<{ children: React.ReactNode; duration?: number }> = ({ children, duration = 12 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duration], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  if (p >= 1) return <>{children}</>;
  const cx = WIDTH / 2;
  const cy = HEIGHT * 0.56;
  const r = p * 2900;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: C.ochre, clipPath: triangle(cx, cy, r * 1.12 + 40) }} />
      <AbsoluteFill style={{ clipPath: triangle(cx, cy, r) }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// D’OME lattice wordmark that draws itself: outlines trace in, lattices fade in, the ochre apostrophe drops.
export const Logo: React.FC<{ width: number; start?: number; color?: string }> = ({ width, start = 0, color = C.paper }) => {
  const frame = useCurrentFrame() - start;
  const { fps } = useVideoConfig();
  const draw = (a: number, b: number) => 1 - interpolate(frame, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const fade = (a: number, b: number) => interpolate(frame, [a, b], [0, 1], clamp);
  const drop = spring({ frame: frame - 16, fps, config: { damping: 10, stiffness: 160, mass: 0.6 } });
  const stroke = { pathLength: 1, strokeDasharray: 1, fill: 'none' } as const;
  return (
    <svg width={width} viewBox={LOGO.viewBox} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <path d={LOGO.dLattice} strokeWidth={5} opacity={fade(6, 24)} />
      <path d={LOGO.dOutline} strokeWidth={14} {...stroke} strokeDashoffset={draw(0, 22)} />
      <g transform={`translate(0 ${(1 - drop) * -60})`} opacity={Math.min(1, drop * 2)}>
        <path d={LOGO.apostrophe} fill={C.ochre} stroke="none" />
      </g>
      <g transform={`translate(${LOGO.oTranslate})`}>
        <path d={LOGO.oLattice} strokeWidth={5} opacity={fade(8, 26)} />
        <circle r={103.3} strokeWidth={14} {...stroke} strokeDashoffset={draw(4, 26)} transform="rotate(-90)" />
      </g>
      <path d={LOGO.me} strokeWidth={14} {...stroke} strokeDashoffset={draw(10, 34)} />
    </svg>
  );
};
