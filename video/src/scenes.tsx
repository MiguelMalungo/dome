import React from 'react';
import { AbsoluteFill, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from './brand';
import { Eyebrow, headline, Logo, Photo, Pop, Shade, Title, Tri, TriangleReveal, Words } from './components';
import type { Copy } from './copy';
import { FONT } from './fonts';
import { BEAT, END_HIT, SAFE, SCENES, WIDTH } from './timeline';
// Shared with the website: cover photos and the code-drawn illustrations.
import coverOsb from '../../src/assets/photos/cover-osb.jpg';
import coverCork from '../../src/assets/photos/cover-cork.jpg';
import coverFabric from '../../src/assets/photos/cover-fabric.jpg';
import coverGlass from '../../src/assets/photos/cover-glass.jpg';
import panelA from '../../src/illustrations/panel-a.svg';
import panelB from '../../src/illustrations/panel-b.svg';
import frameA from '../../src/illustrations/frame-a.svg';
import frameB from '../../src/illustrations/frame-b.svg';
import domeDrawing from '../../src/illustrations/dome-osb.svg';

type P = { c: Copy };
const len = (s: keyof typeof SCENES) => SCENES[s][1] - SCENES[s][0];
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Bar 0, as the groove comes in: "105 triangles", drawn as the hollow timber structure pieces,
// 75 type A (wood) + 30 type B (ochre), assembling over the bar.
export const Hook: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const side = 104;
  const h = side * 0.866;
  const cols = 15;
  const rows = 7;
  const x0 = (WIDTH - (cols + 1) * (side / 2)) / 2;
  const y0 = 790;
  const order = Array.from({ length: cols * rows }, (_, i) => i).sort((a, b) => random(`o${a}`) - random(`o${b}`));
  const typeB = new Set(order.slice(0, 30)); // 30 type-B panels, scattered
  return (
    <AbsoluteFill style={{ backgroundColor: C.pine, transform: `scale(${1 + frame * 0.0006})` }}>
      <div style={{ position: 'absolute', top: SAFE.top + 10, left: 0, right: 0, textAlign: 'center' }}>
        <p style={{ ...headline, fontSize: 400, color: C.white, lineHeight: 0.9 }}>{c.hookNumber}</p>
        <p style={{ ...headline, fontSize: 118, color: C.ochre, marginTop: 10 }}>{c.hookWord}</p>
      </div>
      <svg width={WIDTH} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: cols * rows }, (_, i) => {
          const r = Math.floor(i / cols);
          const k = i % cols;
          const up = (k + r) % 2 === 0;
          const x = x0 + k * (side / 2);
          const y = y0 + r * h;
          const appear = -8 + order.indexOf(i) * ((len('hook') - 24) / 105); // the whole set is in before the next bar
          const s = interpolate(frame, [appear, appear + 4], [0, 1], clamp);
          const v = up
            ? [[x, y + h], [x + side, y + h], [x + side / 2, y]]
            : [[x, y], [x + side, y], [x + side / 2, y + h]];
          const cx = x + side / 2;
          const cy = up ? y + (h * 2) / 3 : y + h / 3; // centroid = incentre for an equilateral triangle
          const inner = v.map(([px, py]) => [cx + (px - cx) * 0.52, cy + (py - cy) * 0.52]);
          const ring = (q: number[][]) => `M${q.map(([a, b]) => `${a} ${b}`).join(' L')} Z`;
          return (
            <path
              key={i}
              d={`${ring(v)} ${ring(inner)}`}
              fillRule="evenodd"
              fill={typeB.has(i) ? C.ochre : C.wood}
              stroke={C.pine}
              strokeWidth={5}
              strokeLinejoin="round"
              opacity={s}
              transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// "2 shapes." — the structure triangles, with the panels that cover them below — then "1 home." (the dome).
export const Shapes: React.FC<P> = ({ c }) => {
  const rows = [
    { label: c.framesLabel, art: [frameA, frameB], at: 0, top: 540 },
    { label: c.panelsLabel, art: [panelA, panelB], at: BEAT, top: 1010 },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <Sequence durationInFrames={2 * BEAT}>
        <Title>
          <Words text={c.shapes} size={160} color={C.pine} stagger={2} />
        </Title>
        {rows.map((row) => (
          <div key={row.label} style={{ position: 'absolute', top: row.top, left: SAFE.left, right: SAFE.left, display: 'grid', gap: 18 }}>
            <Eyebrow text={row.label} start={row.at} color={C.ochreText} size={30} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: 80 }}>
              {row.art.map((src, i) => (
                <Pop key={i} at={row.at + i * 3} style={{ display: 'grid', justifyItems: 'center', gap: 14 }}>
                  <Img src={src} style={{ width: 300 }} />
                  {row.at === 0 && <span style={{ ...headline, fontSize: 56, color: C.pine }}>{i === 0 ? c.countA : c.countB}</span>}
                </Pop>
              ))}
            </div>
          </div>
        ))}
      </Sequence>
      <Sequence from={2 * BEAT}>
        <Title>
          <Words text={c.home} size={160} color={C.pine} stagger={2} />
        </Title>
        <Pop at={0} from={0.4} style={{ position: 'absolute', top: 560, left: 40, right: 40, display: 'flex', justifyContent: 'center' }}>
          <Img src={domeDrawing} style={{ width: 1000 }} />
        </Pop>
      </Sequence>
    </AbsoluteFill>
  );
};

export const Hero: React.FC<P> = ({ c }) => (
  <TriangleReveal>
    <AbsoluteFill>
      <Photo src={staticFile('shots/hero.jpg')} duration={len('hero')} zoom={[1.08, 1.16]} drift={[70, 20]} />
      <Shade />
      <Title>
        <Eyebrow text={c.heroEyebrow} start={2} />
        <Words text={c.tagline} size={104} start={6} stagger={4} />
      </Title>
    </AbsoluteFill>
  </TriangleReveal>
);

export const Kit: React.FC<P> = ({ c }) => (
  <AbsoluteFill>
    <Photo src={staticFile('shots/kit.jpg')} duration={len('kit')} zoom={[1.06, 1.16]} drift={[20, -30]} />
    <Shade strength={0.9} reach={64} />
    <Title>
      <Words text={c.kitTitle} size={132} stagger={3} />
      <Words
        text={c.kitText}
        size={50}
        start={BEAT}
        stagger={2}
        style={{ fontWeight: 500, fontStretch: '100%', lineHeight: 1.3, letterSpacing: 0, maxWidth: 760, color: 'rgba(251,251,248,0.92)' }}
      />
    </Title>
  </AbsoluteFill>
);

export const Build: React.FC<P> = ({ c }) => (
  <AbsoluteFill>
    <Photo src={staticFile('shots/build.jpg')} duration={len('build')} zoom={[1.1, 1.18]} drift={[95, 60]} />
    <Shade strength={0.88} reach={62} />
    <Title>
      <Words text={c.diy} size={100} stagger={3} />
      <Words text={c.weBuild} size={100} start={2 * BEAT} stagger={3} color={C.ochre} />
    </Title>
  </AbsoluteFill>
);

// Three sizes, drawn to scale on one ground line (42 px per metre of diameter).
export const Sizes: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const base = 1180;
  const margin = 40;
  const gap = 24;
  const diameters = [4, 6, 8];
  const pxPerM = (WIDTH - 2 * margin - 2 * gap) / diameters.reduce((a, b) => a + b, 0);
  let x = margin;
  const domes = diameters.map((d, i) => {
    const w = d * pxPerM;
    const cx = x + w / 2;
    x += w + gap;
    return { w, cx, ...c.sizes[i] };
  });
  const line = interpolate(frame, [6, 20], [0, 1], clamp);
  return (
    <TriangleReveal>
      <AbsoluteFill style={{ backgroundColor: C.paper }}>
        <Title>
          <Eyebrow text={c.sizesEyebrow} color={C.ochreText} />
          <Words text={c.sizesTitle} size={140} color={C.pine} start={2} stagger={3} />
        </Title>
        <div style={{ position: 'absolute', left: margin, top: base, height: 4, width: (WIDTH - margin * 2) * line, backgroundColor: 'rgba(30,61,52,0.25)' }} />
        {domes.map((d, i) => {
          const img = d.w / 0.79; // the dome fills 79% of the drawing's width; its base sits at 67.4% of its height
          return (
            <React.Fragment key={d.d}>
              <Pop at={BEAT * (i + 1)} from={0} style={{ position: 'absolute', left: d.cx - img / 2, top: base - img * 0.674, width: img, transformOrigin: '50% 67%' }}>
                <Img src={domeDrawing} style={{ width: img }} />
              </Pop>
              <Pop at={BEAT * (i + 1) + 3} style={{ position: 'absolute', left: d.cx - 150, width: 300, top: base + 40, textAlign: 'center' }}>
                <div style={{ ...headline, fontSize: 88, color: C.pine }}>{d.d}</div>
                <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 600, color: C.woodDark, marginTop: 12 }}>{d.area}</div>
              </Pop>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </TriangleReveal>
  );
};

// Title card, then one cover per two beats, then all four together.
export const Covers: React.FC<P> = ({ c }) => {
  const photos = [coverOsb, coverCork, coverFabric, coverGlass];
  return (
    <AbsoluteFill style={{ backgroundColor: C.pine }}>
      <Sequence durationInFrames={2 * BEAT}>
        <TriangleReveal>
          <AbsoluteFill style={{ backgroundColor: C.pine }}>
            <Title top={700}>
              <Eyebrow text={c.coversEyebrow} />
              <Words text={c.coversTitle} size={124} stagger={3} />
            </Title>
          </AbsoluteFill>
        </TriangleReveal>
      </Sequence>
      {photos.map((src, i) => (
        <Sequence key={i} from={(2 + i) * BEAT} durationInFrames={BEAT}>
          <Photo src={src} duration={BEAT} zoom={[1.1, 1.16]} pulse={false} />
          <Shade strength={0.7} reach={42} />
          <Title>
            <Eyebrow text={`0${i + 1} / 04`} />
            <Words text={c.covers[i]} size={128} stagger={1} />
          </Title>
        </Sequence>
      ))}
      <Sequence from={6 * BEAT}>
        <CoverGrid photos={photos} labels={c.covers} />
      </Sequence>
    </AbsoluteFill>
  );
};

const CoverGrid: React.FC<{ photos: string[]; labels: string[] }> = ({ photos, labels }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8, backgroundColor: C.pine }}>
      {photos.map((src, i) => {
        const p = spring({ frame: frame - i * 2, fps, config: { damping: 200, stiffness: 200 } });
        return (
          <div key={i} style={{ position: 'relative', overflow: 'hidden', opacity: p }}>
            <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.25 - 0.13 * p + frame * 0.002})` }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(14,30,24,0.65) 0%, rgba(14,30,24,0) 40%)' }} />
            <div style={{ position: 'absolute', top: i < 2 ? SAFE.top : 48, left: i % 2 ? 40 : SAFE.left, right: 30, display: 'flex', gap: 14, alignItems: 'center' }}>
              <Tri size={30} />
              <span style={{ ...headline, fontSize: 52, color: C.white }}>{labels[i]}</span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Interior: React.FC<P> = ({ c }) => (
  <TriangleReveal>
    <AbsoluteFill>
      <Photo src={staticFile('shots/interior.jpg')} duration={len('interior')} zoom={[1.02, 1.12]} drift={[30, 0]} />
      <Shade strength={0.62} reach={42} />
      <Title>
        <Words text={c.interior} size={132} start={8} stagger={5} />
      </Title>
    </AbsoluteFill>
  </TriangleReveal>
);

export const Services: React.FC<P> = ({ c }) => (
  <AbsoluteFill style={{ backgroundColor: C.pine }}>
    <Title top={560}>
      <Eyebrow text={c.servicesEyebrow} />
      <div style={{ display: 'grid', gap: 34, marginTop: 20 }}>
        {c.services.map((s, i) => (
          <Pop key={s} at={i * BEAT} from={0.85} style={{ display: 'flex', alignItems: 'flex-start', gap: 28, transformOrigin: 'left center' }}>
            <Tri size={50} style={{ flex: 'none', marginTop: 24 }} />
            <span style={{ ...headline, fontSize: 84, fontStretch: '108%', color: C.white }}>{s}</span>
          </Pop>
        ))}
      </div>
    </Title>
  </AbsoluteFill>
);

// In the bass-less break: the logo draws itself, then the call to action pops on the break's second bar.
export const End: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const tagline = interpolate(frame, [26, 38], [0, 1], clamp);
  return (
    <TriangleReveal>
      <AbsoluteFill style={{ backgroundColor: C.pine, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 56, marginTop: -160 }}>
          <Logo width={860} start={4} />
          <p style={{ fontFamily: FONT, fontWeight: 600, fontSize: 46, letterSpacing: '0.04em', color: C.paper, opacity: tagline * 0.85, margin: 0 }}>{c.brandLine}</p>
          <Pop at={END_HIT} from={0.7} style={{ display: 'grid', justifyItems: 'center', gap: 26, marginTop: 40 }}>
            <span style={{ ...headline, fontSize: 68, color: C.pine, backgroundColor: C.ochre, padding: '30px 66px 34px', borderRadius: 999 }}>{c.cta}</span>
            <span style={{ ...headline, fontSize: 64, fontStretch: '108%', letterSpacing: '0.01em', color: C.paper }}>{c.site}</span>
          </Pop>
        </div>
      </AbsoluteFill>
    </TriangleReveal>
  );
};
