// Beat map for hazy-nature-mood.mp3 ("Hazy Nature Mood", Suno, 90.75 BPM measured), played from 0:31.8.
// Bar 0 is the downbeat at 31.79 s (the first frame of the video). 4 bars of the lighter groove, then
// the big drop at 42.36 s (bar 4), 8 bars of full beat, and a bass-less break from bar 12 (63.5 s) until
// the beat returns at bar 14 (68.8 s); the video ends just before that.
// A beat is 19.83 frames at 30 fps, so bars are computed from the exact tempo and rounded to the nearest
// frame (error < 17 ms). Every scene starts on a bar so cuts land on the kick.
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const MUSIC = {
  file: 'music/hazy-nature-mood.mp3',
  startFrame: 953, // 31.77 s into the song
  bpm: 90.75,
  downbeatS: 31.79, // bar 0
};

export const FPB = (FPS * 60) / MUSIC.bpm; // frames per beat, 19.83
export const BEAT = Math.round(FPB); // for timings inside a scene
const FIRST = Math.round((MUSIC.downbeatS - MUSIC.startFrame / FPS) * FPS); // frame of bar 0
export const bar = (n: number) => Math.round(FIRST + n * 4 * FPB);
export const DURATION = bar(14) - 4; // ≈ 37 s

export const SCENES = {
  // lighter groove
  hook: [0, bar(1)],
  shapes: [bar(1), bar(2)],
  kit: [bar(2), bar(3)],
  build: [bar(3), bar(4)],
  // the big drop
  hero: [bar(4), bar(6)],
  sizes: [bar(6), bar(8)],
  covers: [bar(8), bar(10)],
  interior: [bar(10), bar(11)],
  services: [bar(11), bar(12)],
  // the break
  end: [bar(12), DURATION],
} as const;

// Frames from the start of the end card to the second bar of the break: the call to action pops on it.
export const END_HIT = bar(13) - bar(12);

// Keep text inside this box: Reels/TikTok put the caption at the bottom and buttons on the right.
export const SAFE = { left: 80, right: 160, top: 220, bottom: 420 };
