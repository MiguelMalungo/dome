// The 3V 5/8 geodesic dome, built exactly like scripts/illustrations/geo.py + render.py:
// an icosahedron with a vertex pointing up, each face split 3 × 3, projected onto the unit sphere,
// cut at z = −0.2 (105 faces) with the base ring flattened. Each face is a type A (75) or type B (30)
// structure triangle, classified by its side lengths on the sphere.
export type Vec3 = [number, number, number];
export type FaceType = 'A' | 'B';
export interface Face {
  /** Corners in three.js space: y up, unit sphere radius, base ring at y = 0. */
  v: [Vec3, Vec3, Vec3];
  type: FaceType;
}

const norm = (p: Vec3): Vec3 => {
  const l = Math.hypot(p[0], p[1], p[2]);
  return [p[0] / l, p[1] / l, p[2] / l];
};

function icosahedron(): { V: Vec3[]; F: [number, number, number][] } {
  const p = (1 + Math.sqrt(5)) / 2;
  const V: Vec3[] = [
    [-1, p, 0], [1, p, 0], [-1, -p, 0], [1, -p, 0],
    [0, -1, p], [0, 1, p], [0, -1, -p], [0, 1, -p],
    [p, 0, -1], [p, 0, 1], [-p, 0, -1], [-p, 0, 1],
  ];
  const F: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  return { V, F };
}

// Rotate so that vertex 0 points to +z (Rodrigues' rotation), as in geo.py.
function vertexUp(V: Vec3[]): Vec3[] {
  const a = norm(V[0]);
  const ax: Vec3 = [a[1], -a[0], 0]; // a × (0, 0, 1)
  const s = Math.hypot(ax[0], ax[1], ax[2]);
  const k: Vec3 = [ax[0] / s, ax[1] / s, ax[2] / s];
  const th = Math.atan2(s, a[2]);
  const cos = Math.cos(th);
  const sin = Math.sin(th);
  return V.map((v) => {
    const kv = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
    const cr: Vec3 = [k[1] * v[2] - k[2] * v[1], k[2] * v[0] - k[0] * v[2], k[0] * v[1] - k[1] * v[0]];
    return [0, 1, 2].map((i) => v[i] * cos + cr[i] * sin + k[i] * kv * (1 - cos)) as Vec3;
  });
}

function geodesic(freq: number) {
  const ico = icosahedron();
  const V = vertexUp(ico.V.map(norm));
  const verts: Vec3[] = [];
  const index = new Map<string, number>();
  const add = (q: Vec3) => {
    const p = norm(q);
    const key = p.map((c) => (Math.round(c * 1e6) / 1e6).toFixed(6)).join(',');
    let i = index.get(key);
    if (i === undefined) {
      i = verts.length;
      index.set(key, i);
      verts.push(p);
    }
    return i;
  };
  const faces: [number, number, number][] = [];
  for (const [ia, ib, ic] of ico.F) {
    const A = V[ia];
    const B = V[ib];
    const C = V[ic];
    const grid = new Map<string, number>();
    for (let i = 0; i <= freq; i++)
      for (let j = 0; j <= freq - i; j++) {
        const k = freq - i - j;
        grid.set(`${i},${j}`, add([0, 1, 2].map((t) => (A[t] * i + B[t] * j + C[t] * k) / freq) as Vec3));
      }
    const g = (i: number, j: number) => grid.get(`${i},${j}`)!;
    for (let i = 0; i < freq; i++)
      for (let j = 0; j < freq - i; j++) {
        faces.push([g(i, j), g(i + 1, j), g(i, j + 1)]);
        if (i + j < freq - 1) faces.push([g(i + 1, j), g(i + 1, j + 1), g(i, j + 1)]);
      }
  }
  return { verts, faces };
}

const CUT = -0.2;
const BASE = -0.18;

export function domeFaces(): Face[] {
  const { verts, faces } = geodesic(3);
  const kept = faces.filter((f) => f.every((i) => verts[i][2] >= CUT));
  const dist = (p: Vec3, q: Vec3) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
  return kept.map((f) => {
    const [p, q, r] = f.map((i) => verts[i]);
    const sides = [dist(p, q), dist(q, r), dist(r, p)].sort((x, y) => x - y);
    const type: FaceType = Math.abs(sides[2] - sides[1]) < 1e-3 ? 'A' : 'B';
    // Flatten the base ring like render.py, then convert z-up to three.js y-up with the base at y = 0.
    const v = f.map((i) => {
      const [x, y, z] = verts[i];
      const zz = z < -0.15 ? Math.max(z, BASE) : z;
      return [x, zz - BASE, -y] as Vec3;
    }) as [Vec3, Vec3, Vec3];
    return { v, type };
  });
}
