// A small three.js stage for the dome: warm dusk light, drag to turn (with inertia), gentle pointer
// parallax, hover picking of single triangles, and no rendering while it is off screen.
import {
  ACESFilmicToneMapping,
  DirectionalLight,
  HemisphereLight,
  PerspectiveCamera,
  PMREMGenerator,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { DomeModel, type Piece } from './DomeModel';

export interface Framing {
  /** Dome centre in the canvas, as fractions of its width and height. */
  x: number;
  y: number;
  /** Width of the deck as a fraction of the canvas width (capped by the height). */
  fill: number;
}

export interface ViewerOptions {
  canvas: HTMLCanvasElement;
  framing: (w: number, h: number) => Framing;
  autoRotate?: number;
  onHover?: (piece: Piece | null, x: number, y: number) => void;
  onDrag?: () => void;
  onFrame?: (now: number) => void;
}

const FOV = 30;
const DECK = 2.32;

export function createViewer(o: ViewerOptions) {
  const canvas = o.canvas;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.32;
  const key = new DirectionalLight('#ffcf8f', 2.7);
  key.position.set(-3, 4.2, 3);
  const rim = new DirectionalLight('#a8d8c8', 0.9);
  rim.position.set(3.5, 2, -3.5);
  scene.add(new HemisphereLight('#ffe7c4', '#142a22', 1.1), key, rim);

  const model = new DomeModel();
  scene.add(model.root);
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 60);
  const target = new Vector3(0, 0.52, 0);

  const s = {
    yaw: -0.5,
    vel: 0,
    dist: 6,
    px: 0,
    py: 0,
    tx: 0,
    ty: 0,
    dragging: false,
    lastX: 0,
    downX: 0,
    idleSince: 0,
    hoverDirty: false,
    hx: 0,
    hy: 0,
    w: 1,
    h: 1,
  };

  // `focus` (0 → 1) eases from the layout's framing to the dome centred and closer.
  let focus = 0;
  function reframe() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    if (w !== s.w || h !== s.h) renderer.setSize(w, h, false);
    s.w = w;
    s.h = h;
    const a = o.framing(w, h);
    const k = focus * focus * (3 - 2 * focus);
    const f = { x: a.x + (0.5 - a.x) * k, y: a.y + (0.5 - a.y) * k, fill: a.fill + (Math.min(0.62, a.fill * 1.6) - a.fill) * k };
    camera.aspect = w / h;
    const tan = Math.tan((FOV * Math.PI) / 360);
    // Distance at which the deck spans `fill` of the width, but never more than 78 % of the height.
    const byWidth = DECK / (f.fill * (w / h)) / (2 * tan);
    const byHeight = (DECK * 0.62) / 0.78 / (2 * tan);
    s.dist = Math.max(byWidth, byHeight);
    camera.setViewOffset(w, h, (0.5 - f.x) * w, (0.5 - f.y) * h, w, h);
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(reframe);
  ro.observe(canvas);
  reframe();

  // Pointer: drag to turn, parallax and hover otherwise.
  const ray = new Raycaster();
  const ndc = new Vector2();
  let tapTimer = 0;
  canvas.addEventListener('pointerdown', (e) => {
    s.dragging = true;
    s.lastX = s.downX = e.clientX;
    s.vel = 0;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    s.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    s.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    if (s.dragging) {
      const dx = e.clientX - s.lastX;
      s.lastX = e.clientX;
      s.yaw += dx * 0.0075;
      s.vel = dx * 0.45;
      s.idleSince = performance.now();
      if (Math.abs(e.clientX - s.downX) > 6) o.onDrag?.();
    } else if (e.pointerType === 'mouse') {
      s.hoverDirty = true;
      s.hx = e.clientX;
      s.hy = e.clientY;
    }
  });
  const end = (e: PointerEvent) => {
    if (!s.dragging) return;
    s.dragging = false;
    canvas.classList.remove('is-dragging');
    s.idleSince = performance.now();
    // A tap (no drag) on touch shows what was tapped for a moment.
    if (e.pointerType !== 'mouse' && Math.abs(e.clientX - s.downX) < 8) {
      s.hoverDirty = true;
      s.hx = e.clientX;
      s.hy = e.clientY;
      clearTimeout(tapTimer);
      tapTimer = window.setTimeout(() => {
        model.hover(null);
        o.onHover?.(null, 0, 0);
      }, 2200);
    }
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
    s.tx = s.ty = 0;
    model.hover(null);
    o.onHover?.(null, 0, 0);
  });

  function pick() {
    s.hoverDirty = false;
    const r = canvas.getBoundingClientRect();
    ndc.set(((s.hx - r.left) / r.width) * 2 - 1, -((s.hy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(model.pickables(), false)[0];
    const index = hit ? (hit.object.userData.piece as number) : null;
    model.hover(index);
    o.onHover?.(index === null ? null : model.pieces[index], s.hx - r.left, s.hy - r.top);
  }

  // Render loop, only while visible. (Dev builds keep drawing in hidden tabs, on a timer, for previews.)
  const devHidden = () => import.meta.env.DEV && document.hidden;
  const schedule = (cb: (t: number) => void) => (devHidden() ? window.setTimeout(() => cb(performance.now()), 16) : requestAnimationFrame(cb));
  const cancel = (id: number) => (devHidden() ? clearTimeout(id) : cancelAnimationFrame(id));
  let raf = 0;
  let last = 0;
  let visible = true;
  let paused = false;
  function tick(t: number) {
    const dt = Math.min((t - last) / 1000, 0.05);
    last = t;
    if (!s.dragging) {
      s.yaw += s.vel * dt; // vel in rad/s, from the last drag move
      s.vel *= Math.exp(-dt * 2.6);
      if (o.autoRotate && t - s.idleSince > 1800) s.yaw += o.autoRotate * dt;
    }
    s.px += (s.tx - s.px) * Math.min(1, dt * 3);
    s.py += (s.ty - s.py) * Math.min(1, dt * 3);
    model.root.rotation.y = s.yaw;
    const el = 0.2 - s.py * 0.06;
    const az = s.px * 0.08;
    camera.position.set(target.x + s.dist * Math.sin(az) * Math.cos(el), target.y + s.dist * Math.sin(el), target.z + s.dist * Math.cos(az) * Math.cos(el));
    camera.lookAt(target);
    model.update(t / 1000);
    o.onFrame?.(t / 1000);
    if (s.hoverDirty) pick();
    renderer.render(scene, camera);
    raf = schedule(tick);
  }
  function sync() {
    const run = visible && !paused && (!document.hidden || import.meta.env.DEV);
    if (run && !raf) {
      last = performance.now();
      raf = schedule(tick);
    } else if (!run && raf) {
      cancel(raf);
      raf = 0;
    }
  }
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    sync();
  }).observe(canvas);
  document.addEventListener('visibilitychange', sync);
  sync();

  const v = new Vector3();
  return {
    model,
    camera,
    renderer,
    reframe,
    setFocus(f: number) {
      if (f === focus) return;
      focus = f;
      reframe();
    },
    setPaused(p: boolean) {
      paused = p;
      sync();
    },
    /** Screen position (CSS px, relative to the canvas) of a point in dome space. */
    project(x: number, y: number, z: number) {
      v.set(x, y, z).applyMatrix4(model.root.matrixWorld).project(camera);
      return { x: ((v.x + 1) / 2) * s.w, y: ((1 - v.y) / 2) * s.h };
    },
    now: () => performance.now() / 1000,
  };
}

export type Viewer = ReturnType<typeof createViewer>;
