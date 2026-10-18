// Generates the site photos (src/assets/photos/) and the promo video shots (video/public/shots/)
// with the Higgsfield API.
// Run: npm run photos -- [names…] [--force] [--dry-run] [--resolution 720p|1080p] [--model <id>]
//   names        only these photos (default: every photo that doesn't exist yet)
//   --force      regenerate even if the photo already exists (replaces it)
//   --dry-run    print what would be generated, call nothing
// Credentials go in .env (gitignored): HF_API_KEY_ID and HF_API_KEY_SECRET,
// or HF_KEY="<id>:<secret>". Get them at https://cloud.higgsfield.ai (API keys).
// Each image spends API credits. Saved as JPEG (sharp, already a dependency) to keep the repo small.
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = join(ROOT, 'src/assets/photos');
const SHOTS = join(ROOT, 'video/public/shots'); // vertical 9:16 stills for the Remotion promo
const API = 'https://api.higgsfield.ai';

// Shared by every prompt so the set looks like one shoot of one product.
const DOME =
  'a round geodesic dome (Buckminster Fuller style) built from many small flat triangular timber panels, a 3-frequency dome slightly taller than a hemisphere, so the lower walls rise almost vertically before curving into the roof';
const STYLE =
  'photorealistic, architectural photography, natural colours, sharp detail, no people, no text, no logos, no watermark';

const PHOTOS = [
  {
    name: 'hero',
    aspect: '16:9',
    prompt: `${DOME}, clad in warm natural wooden shingles with a few triangular windows glowing softly, standing on a low wooden deck in a meadow with cork oaks in the Alentejo, Portugal, golden hour light, dome placed in the right third of the frame with open sky and calm meadow on the left, ${STYLE}`,
  },
  {
    name: 'kit',
    aspect: '4:3',
    prompt: `product photo in a bright timber workshop: in the foreground a neat pile of large hollow wooden triangles, each one an empty triangle frame made of three thick light pine beams screwed together at the corners, you can see the floor through the middle of each triangle; the pile rests on top of a stack of flat triangular plywood panels of the same size; steel connector plates and bolts in a box beside them, ${STYLE}`,
  },
  {
    name: 'montagem',
    aspect: '4:3',
    prompt: `${DOME}, under construction: the lower half already assembled from light plywood triangles bolted edge to edge in a geodesic pattern, the top half not built yet so the open edge forms a zigzag ring of triangles, on a round timber platform, a stepladder and a toolbox nearby, a stack of flat triangular panels on the grass, rural Portugal, soft morning light, ${STYLE}`,
  },
  {
    name: 'cover-osb',
    aspect: '1:1',
    prompt: `${DOME} used as a small cabin, its rounded surface fully clad in natural cedar wooden shingles so the triangle seams still show, three small triangular windows and a wooden door, small wooden deck, on a gentle slope with pine trees in Portugal, clear afternoon light, ${STYLE}`,
  },
  {
    name: 'cover-cork',
    aspect: '1:1',
    prompt: `${DOME} used as a small home, fully clad in dark brown expanded cork agglomerate boards with a coarse granular texture so the triangle seams still show, three triangular windows and a wooden door, small wooden deck, among cork oaks in the Alentejo, Portugal, warm late afternoon light, ${STYLE}`,
  },
  {
    name: 'cover-fabric',
    aspect: '1:1',
    prompt: `${DOME}, covered with a tensioned off-white technical fabric membrane over the visible wooden triangular frame, used as a glamping retreat, wooden deck and two chairs in front, in a cork oak forest clearing in Portugal, late afternoon warm light, ${STYLE}`,
  },
  {
    name: 'cover-glass',
    aspect: '1:1',
    prompt: `${DOME} used as a greenhouse and garden room: the whole rounded dome is glazed, every triangle a glass pane in a thin light timber frame, plants and a wooden table visible inside, blue hour with warm interior light glowing, garden with olive trees around it, ${STYLE}`,
  },
  {
    name: 'interior',
    aspect: '16:9', // the API has no 21:9; the site crops it to 21:9 on desktop, so keep the subject in the middle band
    // Evening mood: lit only by warm lamps, deep amber and red glow.
    prompt: `living room inside ${DOME} in the evening, lit only by many warm glowing lamps: a large round rice-paper lantern, red and orange glass pendant lamps, small mushroom table lamps, a tall stacked paper globe floor lamp, deep amber, orange and red light reflecting on the light timber triangles of the curved ceiling, soft shadows, cosy and moody, low sofa, striped wool rug, a few plants, main subject in the middle of the frame, photorealistic interior photography, warm cinematic colour, no people, no text, no logos, no watermark`,
  },
  // Promo video (video/): vertical 9:16, subject low in the frame so titles fit in the sky/top.
  {
    name: 'video-hero',
    dir: SHOTS,
    file: 'hero',
    aspect: '9:16',
    prompt: `${DOME}, clad in warm natural wooden shingles with a few triangular windows glowing softly, standing on a low wooden deck in a meadow with cork oaks in the Alentejo, Portugal, golden hour, vertical composition with the dome in the lower half and a wide clear evening sky above, ${STYLE}`,
  },
  {
    name: 'video-kit',
    dir: SHOTS,
    file: 'kit',
    aspect: '9:16',
    prompt: `product photo in a bright timber workshop: in the foreground a tall neat pile of large hollow wooden triangles, each one an empty triangle frame made of three thick light pine beams screwed together at the corners, you can see through the middle of each triangle; the pile rests on top of a stack of flat triangular plywood panels of the same size; steel connector plates and bolts beside them, vertical composition, ${STYLE}`,
  },
  {
    name: 'video-build',
    dir: SHOTS,
    file: 'build',
    aspect: '9:16',
    prompt: `${DOME}, under construction: the lower half already assembled from light plywood triangles bolted edge to edge in a geodesic pattern, the top still open to the sky, on a round timber platform, a stepladder beside it, rural Portugal, soft morning light, vertical composition with the dome in the lower half and sky above, ${STYLE}`,
  },
  {
    name: 'video-interior',
    dir: SHOTS,
    file: 'interior',
    aspect: '9:16',
    prompt: `living room inside ${DOME} in the evening, lit only by many warm glowing lamps: a large round rice-paper lantern hanging high, red and orange glass pendant lamps, small mushroom table lamps, a tall stacked paper globe floor lamp, deep amber, orange and red light on the light timber triangles of the curved ceiling, soft shadows, cosy and moody, low sofa, striped wool rug, vertical composition looking up towards the ceiling, photorealistic interior photography, warm cinematic colour, no people, no text, no logos, no watermark`,
  },
];

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const option = (f, fallback) => (args.includes(f) ? args[args.indexOf(f) + 1] : fallback);
const optionValues = new Set(['--resolution', '--model'].map((f) => option(f)).filter(Boolean));
const names = args.filter((a) => !a.startsWith('--') && !optionValues.has(a));
const force = flag('--force');
const dryRun = flag('--dry-run');
const resolution = option('--resolution', '1080p');
const model = option('--model', process.env.HIGGSFIELD_MODEL ?? 'higgsfield-ai/soul/standard');

const unknown = names.filter((n) => !PHOTOS.some((p) => p.name === n));
if (unknown.length) fail(`Unknown photo name(s): ${unknown.join(', ')}. Known: ${PHOTOS.map((p) => p.name).join(', ')}`);

const dirOf = (p) => p.dir ?? OUT;
const fileOf = (p) => p.file ?? p.name;
const existing = (p) => (existsSync(dirOf(p)) ? readdirSync(dirOf(p)).filter((f) => f.replace(/\.[^.]+$/, '') === fileOf(p)) : []);
const todo = PHOTOS.filter((p) => (names.length ? names.includes(p.name) : true)).filter((p) => force || existing(p).length === 0);

if (!todo.length) {
  console.log('Nothing to generate: every photo already exists. Use --force to replace one.');
  process.exit(0);
}

if (dryRun) {
  for (const p of todo) console.log(`\n${p.name} (${p.aspect}, ${resolution}, ${model})\n${p.prompt}`);
  process.exit(0);
}

if (existsSync(join(ROOT, '.env'))) process.loadEnvFile(join(ROOT, '.env'));
const { HF_KEY, HF_API_KEY_ID, HF_API_KEY_SECRET } = process.env;
const key = HF_KEY || (HF_API_KEY_ID && HF_API_KEY_SECRET && `${HF_API_KEY_ID}:${HF_API_KEY_SECRET}`);
if (!key || !key.includes(':')) fail('Missing Higgsfield credentials. Put HF_API_KEY_ID and HF_API_KEY_SECRET in .env (see the top of this file).');
const headers = { Authorization: `Key ${key}`, 'Content-Type': 'application/json' };

let failed = 0;
for (const p of todo) {
  try {
    await generate(p);
  } catch (err) {
    failed++;
    console.error(`✗ ${p.name}: ${err.message}`);
  }
}
process.exit(failed ? 1 : 0);

async function generate(p) {
  console.log(`→ ${p.name}: submitting (${p.aspect}, ${resolution})…`);
  const submitted = await api(`${API}/${model}`, {
    method: 'POST',
    headers: { ...headers, 'Idempotency-Key': randomUUID() },
    body: JSON.stringify({ prompt: p.prompt, aspect_ratio: p.aspect, resolution, num_images: 1 }),
  });

  const statusUrl = submitted.status_url ?? `${API}/requests/${submitted.request_id}/status`;
  const started = Date.now();
  let result = submitted;
  while (['queued', 'in_progress'].includes(result.status)) {
    if (Date.now() - started > 10 * 60_000) throw new Error(`timed out (request ${submitted.request_id})`);
    await new Promise((r) => setTimeout(r, 4000));
    result = await api(statusUrl, { headers });
  }
  if (result.status !== 'completed') throw new Error(`${result.status}${result.error ? `: ${result.error}` : ''} (request ${submitted.request_id})`);

  const url = result.images?.[0]?.url;
  if (!url) throw new Error(`completed without an image (request ${submitted.request_id})`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: HTTP ${res.status}`);
  const jpeg = await sharp(Buffer.from(await res.arrayBuffer())).jpeg({ quality: 90, mozjpeg: true }).toBuffer();

  // Remove the old version (any extension) so getPhoto() picks up the new one.
  for (const f of existing(p)) unlinkSync(join(dirOf(p), f));
  mkdirSync(dirOf(p), { recursive: true });
  const file = join(dirOf(p), `${fileOf(p)}.jpg`);
  writeFileSync(file, jpeg);
  console.log(`✓ ${p.name}: saved ${relative(ROOT, file)}`);
}

async function api(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { detail: text };
  }
  if (!res.ok) {
    const detail = body.detail ?? text;
    throw new Error(`HTTP ${res.status}: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
  }
  return body;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
