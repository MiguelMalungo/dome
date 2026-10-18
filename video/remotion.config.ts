// Render settings for Instagram Reels / TikTok: H.264, yuv420p, AAC audio.
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(20); // high quality, and keeps a 42 s file under ~30 MB (Instagram/TikTok re-encode anyway)
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
