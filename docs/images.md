# Photos

The site works without photos: every slot falls back to a dome illustration drawn in code.
Drop a photo into `src/assets/photos/` with the file name below and rebuild. It replaces the illustration automatically and Astro optimises it (resizing, WebP). `.jpg`, `.png`, `.webp` and `.avif` all work.

| File name | Where it appears | Ratio |
| --- | --- | --- |
| `hero` | Full-screen hero (switches the hero to photo mode) | 16:9 |
| `kit` | “How it works”, under the panels card | 4:3 |
| `montagem` | “How it works”, main image (replaces the half-built dome drawing) | 4:3 |
| `cover-osb` | Covers → OSB card | 1:1 |
| `cover-cork` | Covers → cork card | 1:1 |
| `cover-fabric` | Covers → fabric card | 1:1 |
| `cover-glass` | Covers → glass card | 1:1 |
| `interior` | Wide image under the models, evening lamplight (cropped to 21:9 on desktop) | 16:9 |

## Generate them with Higgsfield

`scripts/photos/higgsfield.mjs` holds one prompt per photo and calls the Higgsfield API (model `higgsfield-ai/soul/standard`).

1. Create an API key at https://cloud.higgsfield.ai. The API is billed from its own balance, separate from a higgsfield.ai plan.
2. Put it in `.env` (gitignored): `HF_API_KEY_ID=…` and `HF_API_KEY_SECRET=…`.
3. Run:

```sh
npm run photos                     # every photo that doesn't exist yet
npm run photos -- hero --force     # redo one
npm run photos -- --dry-run        # show the prompts, spend nothing
```

To change a picture, edit its prompt in the script and run it again with `--force`.

Earlier Canva drafts, if you prefer one (Download → JPG, rename as above): [hero](https://www.canva.com/M/MAHYQZYgv0A), [kit](https://www.canva.com/M/MAHYQUWK4MQ), [montagem](https://www.canva.com/M/MAHYQb9Ayso), [cover-osb](https://www.canva.com/M/MAHYQVGY-pw).

Tip: keep the dome a **5/8 dome made of triangles** (walls rise almost vertically before curving) so the photos match the illustrations and the specs. Replace AI images with real project photos as soon as you have them.
