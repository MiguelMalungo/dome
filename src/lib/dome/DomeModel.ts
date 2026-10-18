// The dome as the kit is built: one timber triangle frame per face (the structure, 75 A + 30 B), each
// with a cover panel of the same shape on top. Three motions, all per triangle:
// - assembly: frames fly in and lock into place ring by ring, from the ground up;
// - cladding: panels settle onto the frames that are already in place;
// - skin: panels flip over like tiles to change cover (OSB, cork, fabric, glass, or OSB with glass).
import {
  CircleGeometry,
  CylinderGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  Quaternion,
  Shape,
  Vector2,
  Vector3,
  Matrix4,
  type Material,
} from 'three';
import { domeFaces, type FaceType } from './geometry';
import * as tex from './textures';

export type Skin = 'osb' | 'cork' | 'fabric' | 'glass' | 'mix';
const SKINS = ['osb', 'cork', 'fabric', 'glass'] as const;

export interface Piece {
  index: number;
  type: FaceType;
  group: Object3D;
  frame: Mesh;
  pivot: Object3D;
  panel: Mesh;
  restPos: Vector3;
  restQuat: Quaternion;
  normal: Vector3;
  centroid: Vector3;
  /** 0 at the base ring, 1 at the top. */
  height: number;
  delay: number;
  spinAxis: Vector3;
  spin: number;
  drift: Vector3;
  skin: number;
  target: number;
  flipStart: number;
  inMix: boolean;
}

const MEMBER = 0.03; // timber member width, in sphere radii (≈ 9 cm on the D’OME 6)
const DEPTH = 0.045; // frame depth
const GAP = 0.985; // frames are separate pieces: a hairline gap between neighbours
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function triangleShape(pts: Vector2[], scale: number, hole?: number) {
  const s = new Shape(pts.map((p) => p.clone().multiplyScalar(scale)));
  if (hole) s.holes.push(new Shape(pts.map((p) => p.clone().multiplyScalar(scale * hole)).reverse()));
  return s;
}

export class DomeModel {
  root = new Group();
  dome = new Group();
  pieces: Piece[] = [];
  materials: { frame: MeshStandardMaterial; frameHot: MeshStandardMaterial; skins: Material[] };
  private hovered: Piece | null = null;
  private center = new Vector3(0, 0.18, 0); // sphere centre: the base sits 0.18 R below it

  constructor() {
    const pine = tex.pine();
    const frame = new MeshStandardMaterial({ map: pine, color: 0xffffff, roughness: 0.78 });
    const frameHot = frame.clone();
    frameHot.emissive.set('#d49a2a');
    frameHot.emissiveIntensity = 0.55;
    const skins: Material[] = [
      new MeshStandardMaterial({ map: tex.shingles(), roughness: 0.86 }),
      new MeshStandardMaterial({ map: tex.cork(), roughness: 0.96 }),
      new MeshStandardMaterial({ map: tex.fabric(), roughness: 0.92, side: DoubleSide }),
      new MeshStandardMaterial({ color: '#b9d6cf', roughness: 0.03, metalness: 0.25, transparent: true, opacity: 0.34, depthWrite: false, envMapIntensity: 3 }),
    ];
    this.materials = { frame, frameHot, skins };

    const faces = domeFaces();
    faces.forEach((f, index) => {
      const [p0, p1, p2] = f.v.map((v) => new Vector3(...v));
      const pts = [p0, p1, p2];
      const len = [p0.distanceTo(p1), p1.distanceTo(p2), p2.distanceTo(p0)];
      // The base edge is the odd one out: the shortest side on an A, the longest on a B.
      const order = [0, 1, 2].sort((a, b) => len[a] - len[b]);
      const e = f.type === 'A' ? order[0] : order[2];
      const a = pts[e];
      const b = pts[(e + 1) % 3];
      const apex = pts[(e + 2) % 3];
      const per = len[0] + len[1] + len[2];
      const incenter = new Vector3()
        .addScaledVector(p0, len[1] / per)
        .addScaledVector(p1, len[2] / per)
        .addScaledVector(p2, len[0] / per);
      const centroid = p0.clone().add(p1).add(p2).divideScalar(3);
      let normal = new Vector3().subVectors(p1, p0).cross(new Vector3().subVectors(p2, p0)).normalize();
      if (normal.dot(centroid.clone().sub(this.center)) < 0) normal.negate();
      const u = new Vector3().subVectors(b, a).normalize();
      let w = new Vector3().crossVectors(normal, u);
      if (w.dot(apex.clone().sub(incenter)) < 0) {
        u.negate();
        w = new Vector3().crossVectors(normal, u);
      }
      const local = [a, b, apex].map((p) => {
        const d = p.clone().sub(incenter);
        return new Vector2(d.dot(u), d.dot(w));
      });
      const area = new Vector3().subVectors(p1, p0).cross(new Vector3().subVectors(p2, p0)).length() / 2;
      const inradius = (2 * area) / per;

      const frameGeo = new ExtrudeGeometry(triangleShape(local, GAP, (inradius - MEMBER) / inradius), { depth: DEPTH, bevelEnabled: false });
      frameGeo.translate(0, 0, -DEPTH);
      const frameMesh = new Mesh(frameGeo, frame);
      const panelGeo = new ExtrudeGeometry(triangleShape(local, GAP * 0.985), { depth: 0.008, bevelEnabled: false });
      panelGeo.translate(0, 0, 0.002);
      // Turn the texture so shingle rows and grain run level with the ground on every face.
      const level = new Vector3(0, 1, 0).cross(normal);
      if (level.lengthSq() > 1e-4) {
        level.normalize();
        const phi = Math.atan2(level.dot(w), level.dot(u));
        const cos = Math.cos(-phi);
        const sin = Math.sin(-phi);
        const uv = panelGeo.attributes.uv;
        for (let i = 0; i < uv.count; i++) {
          const x = uv.getX(i);
          const y = uv.getY(i);
          uv.setXY(i, x * cos - y * sin, x * sin + y * cos);
        }
      }
      const panel = new Mesh(panelGeo, skins[0]);
      const pivot = new Object3D();
      pivot.add(panel);
      const group = new Object3D();
      group.add(frameMesh, pivot);
      const basis = new Matrix4().makeBasis(u, w, normal);
      const restQuat = new Quaternion().setFromRotationMatrix(basis);
      group.position.copy(incenter);
      group.quaternion.copy(restQuat);
      frameMesh.userData.piece = panel.userData.piece = index;
      this.dome.add(group);

      const height = clamp01(centroid.y / 1.18);
      const rnd = (k: number) => {
        const x = Math.sin(index * 12.9898 + k * 78.233) * 43758.5453;
        return x - Math.floor(x);
      };
      this.pieces.push({
        index,
        type: f.type,
        group,
        frame: frameMesh,
        pivot,
        panel,
        restPos: incenter.clone(),
        restQuat,
        normal,
        centroid,
        height,
        delay: height * 0.66 + rnd(1) * 0.06,
        spinAxis: new Vector3(rnd(2) - 0.5, rnd(3) - 0.5, rnd(4) - 0.5).normalize(),
        spin: 1.2 + rnd(5) * 1.8,
        drift: new Vector3(rnd(6) - 0.5, rnd(7) * 0.8, rnd(8) - 0.5).multiplyScalar(0.9),
        skin: 0,
        target: 0,
        flipStart: -1,
        // "Any panel can be a window": the combined example glazes the faces turned towards the viewer.
        inMix: normal.z > 0.35 && centroid.y > 0.22 && centroid.y < 1.05,
      });
    });

    // A timber deck and a soft contact shadow.
    const deckTex = tex.deck();
    const deck = new Mesh(new CylinderGeometry(1.16, 1.16, 0.045, 72), new MeshStandardMaterial({ map: deckTex, roughness: 0.85 }));
    deck.position.y = -0.0225 - DEPTH * 0.2;
    const shade = new Mesh(new PlaneGeometry(3.6, 3.6), new MeshBasicMaterial({ map: tex.shadow(), transparent: true, depthWrite: false }));
    shade.rotation.x = -Math.PI / 2;
    shade.position.y = deck.position.y - 0.024;
    const glow = new Mesh(new CircleGeometry(0.9, 48), new MeshBasicMaterial({ color: '#d49a2a', transparent: true, opacity: 0.08, depthWrite: false }));
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = deck.position.y + 0.024;
    this.root.add(shade, deck, glow, this.dome);
  }

  /** Frames fly in and lock into place ring by ring. t: 0 → 1. */
  setAssembly(t: number) {
    const q = new Quaternion();
    for (const p of this.pieces) {
      const k = easeOut(clamp01((t - p.delay) / 0.26)); // delays ≤ 0.72, so every piece is home at t = 1
      const off = 1 - k;
      p.group.visible = k > 0.001;
      p.group.position.copy(p.restPos).addScaledVector(p.normal, off * 1.5).addScaledVector(p.drift, off);
      q.setFromAxisAngle(p.spinAxis, p.spin * off);
      p.group.quaternion.copy(p.restQuat).multiply(q);
      p.group.scale.setScalar(0.55 + 0.45 * k);
      p.frame.userData.placed = k > 0.98;
    }
  }

  /** Panels settle onto the frames, from the ground up. c: 0 → 1. */
  setCladding(c: number) {
    for (const p of this.pieces) {
      const k = easeInOut(clamp01((c - p.height * 0.72) / 0.28)) * (p.frame.userData.placed ? 1 : 0);
      p.panel.visible = k > 0.002;
      p.pivot.position.z = (1 - k) * 0.4;
      p.pivot.scale.setScalar(Math.max(k, 0.0001));
    }
  }

  /** Changes cover with a wave of flipping panels that starts at `origin` (in dome space). */
  setSkin(skin: Skin, now: number, animate = true, origin = new Vector3(0, 1.2, 0)) {
    for (const p of this.pieces) {
      const target = skin === 'mix' ? (p.inMix ? 3 : 0) : SKINS.indexOf(skin);
      if (target === p.target && p.flipStart < 0) continue;
      p.target = target;
      if (!animate) {
        p.skin = target;
        p.panel.material = this.materials.skins[target];
        p.pivot.rotation.x = 0;
        p.flipStart = -1;
        continue;
      }
      if (p.skin === target) continue;
      p.flipStart = now + p.centroid.distanceTo(origin) * 0.55;
    }
  }

  /** Highlights the frame under the pointer. */
  hover(index: number | null) {
    const next = index === null ? null : this.pieces[index];
    if (next === this.hovered) return;
    if (this.hovered) this.hovered.frame.material = this.materials.frame;
    this.hovered = next;
    if (next) next.frame.material = this.materials.frameHot;
  }

  /** Advances panel flips. `now` in seconds. */
  update(now: number) {
    for (const p of this.pieces) {
      if (p.flipStart < 0 || now < p.flipStart) continue;
      const f = clamp01((now - p.flipStart) / 0.42);
      if (f >= 0.5 && p.skin !== p.target) {
        p.skin = p.target;
        p.panel.material = this.materials.skins[p.target];
      }
      p.pivot.rotation.x = f < 0.5 ? Math.PI * f : Math.PI * (f - 1);
      if (f >= 1) {
        p.pivot.rotation.x = 0;
        p.flipStart = -1;
      }
    }
  }

  /** Meshes the pointer can pick (frames, and panels once they are on). */
  pickables() {
    const list: Mesh[] = [];
    for (const p of this.pieces) {
      if (p.group.visible) list.push(p.frame);
      if (p.panel.visible) list.push(p.panel);
    }
    return list;
  }
}
