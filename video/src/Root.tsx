import React from 'react';
import { Composition } from 'remotion';
import './fonts';
import { Promo } from './Promo';
import { DURATION, FPS, HEIGHT, WIDTH } from './timeline';

// 9:16, 1080×1920, 30 fps: one file works for Instagram Reels and TikTok.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="PromoPT" component={Promo} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ lang: 'pt' as const }} />
    <Composition id="PromoEN" component={Promo} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ lang: 'en' as const }} />
  </>
);
