import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from 'remotion';
import { C } from './brand';
import { copy, type Lang } from './copy';
import { Build, Covers, End, Hero, Hook, Interior, Kit, Services, Shapes, Sizes } from './scenes';
import { DURATION, MUSIC, SCENES } from './timeline';

// Each scene runs a few frames past its end so the next one can reveal over it (TriangleReveal).
const OVERLAP = 14;

const order = [
  ['hook', Hook],
  ['shapes', Shapes],
  ['kit', Kit],
  ['build', Build],
  ['hero', Hero],
  ['sizes', Sizes],
  ['covers', Covers],
  ['interior', Interior],
  ['services', Services],
  ['end', End],
] as const;

export const Promo: React.FC<{ lang: Lang }> = ({ lang }) => {
  const c = copy[lang];
  return (
    <AbsoluteFill style={{ backgroundColor: C.pine }}>
      {order.map(([id, Scene]) => {
        const [from, to] = SCENES[id];
        return (
          <Sequence key={id} name={id} from={from} durationInFrames={Math.min(to + OVERLAP, DURATION) - from}>
            <Scene c={c} />
          </Sequence>
        );
      })}
      <Audio
        src={staticFile(MUSIC.file)}
        trimBefore={MUSIC.startFrame}
        // Fade out over the last second of the break, before the beat comes back.
        volume={(f) => interpolate(f, [DURATION - 30, DURATION - 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
      />
    </AbsoluteFill>
  );
};
