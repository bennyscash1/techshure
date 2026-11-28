import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from 'react';
import robot from '../assets/hero-robot.webp';
import { useLang } from '../i18n';

/*
 * Home hero art: tangled lines flow into the Tech-shure robot and leave it as 3 clean parallel lines.
 *
 * Layout is drawn once in the Hebrew (RTL) direction: the tangle enters from the right and the order exits to the
 * left. On /en only the lines layer is mirrored (chaos from the left, order to the right); the robot is never flipped.
 *
 * Motion (no libraries, the `d` attributes are written straight to the DOM through refs, no React state per frame):
 * - Idle: every tangled path slowly sways between two tangled shapes (A and B), one cycle every 7 to 10 seconds.
 * - Order: the tangled paths ease (easeInOutCubic, about 1.5s) into smooth, near-parallel lines that run into the
 *   robot. Going back to the tangle is slower (about 2.8s). The 3 exit lines never move; they only brighten a little.
 * - Desktop (mouse): pointer over the art orders it, leaving returns to the tangle.
 * - Touch: when the art is 60% in view it starts tangled and orders itself after 0.8s (once per visit).
 *   A tap toggles between order and tangle.
 * - Keyboard: focusing the art orders it, blur returns to the tangle.
 * - prefers-reduced-motion: no idle sway and no auto play. The art shows the tangle, still; hover, tap or focus
 *   switches between tangle and order with a short 200ms change only.
 * - The loop stops when nothing moves (ordered, or reduced motion at rest) and pauses while the tab is hidden or the
 *   art is off screen.
 * The first render already holds the still tangle, so there is no layout shift and nothing waits for JavaScript.
 */

const W = 1200;
const H = 420;
const MID = W / 2;

// Robot image (640 x 702 source) placed so its body (not the outstretched arm) sits on the center line.
const ROBOT_H = 350;
const ROBOT_W = (640 * ROBOT_H) / 702;
const ROBOT_X = MID - 402 * (ROBOT_H / 702);
const ROBOT_Y = 34;

// Where the lines meet the robot (all hidden behind its body).
const CHAOS_END_X = 652;
const ORDER_START_X = 560;
const ORDER_Y = [280, 302, 324];

const VIEW_WIDE = { x: 0, y: 0, w: W, h: H };
const VIEW_NARROW = { x: 320, y: 10, w: 560, h: 400 };

const SEGS = 4;
const NUMS = 2 + SEGS * 6;
type Pts = number[]; // M x y, then SEGS cubic segments

type Strand = { a: Pts; b: Pts; o: Pts; period: number; phase: number; width: number; color: string; opacity: number };

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clampY = (y: number) => Math.min(388, Math.max(32, y));

const COLORS: [string, number][] = [
  ['var(--navy)', 0.9],
  ['var(--blue)', 0.85],
  ['var(--cyan)', 0.9],
  ['var(--navy)', 0.45],
  ['var(--blue)', 0.5],
];

function buildStrands(): Strand[] {
  const r = rng(33);
  const out: Strand[] = [];
  const n = 10;
  for (let i = 0; i < n; i++) {
    const sx = 1190 + r() * 40;
    const sy = 70 + r() * 280;
    const ey = 292 + (i * 26) / (n - 1);
    // Knots sit between the far edge and the robot, the last one close enough to read on a phone too.
    const anchors = [
      [sx, sy],
      [1010 + r() * 60, 90 + r() * 240],
      [870 + r() * 40, 130 + r() * 200],
      [760 + r() * 20, 200 + r() * 140],
      [CHAOS_END_X, ey],
    ];
    const a: Pts = [sx, sy];
    for (let s = 0; s < SEGS; s++) {
      const [x0, y0] = anchors[s];
      const [x3, y3] = anchors[s + 1];
      const len = x0 - x3;
      if (s === SEGS - 1) {
        // The last stretch runs calmly into the robot (mostly hidden behind its body).
        a.push(2 * x0 - a[a.length - 4], clampY(2 * y0 - a[a.length - 3]), x3 + len * 0.4, clampY(y3 + (r() - 0.5) * 20), x3, y3);
        continue;
      }
      // Control points that overshoot each other make the curve loop back on itself; a few are kept softer.
      const loop = r() < 0.8 ? 1.2 + r() * 0.5 : 0.4 + r() * 0.3;
      // After the first knot, c1 mirrors the previous c2 so the strand bends smoothly through each anchor.
      const c1 = s === 0 ? [x0 - len * loop, clampY(y0 + (r() - 0.5) * 300)] : [2 * x0 - a[a.length - 4], clampY(2 * y0 - a[a.length - 3])];
      const c2 = [x3 + len * loop, clampY(y3 + (r() - 0.5) * 300)];
      a.push(c1[0], c1[1], c2[0], c2[1], x3, y3);
    }
    // B: the same tangle, nudged, so the idle sway stays calm.
    const b = a.map((v, j) => {
      if (j >= NUMS - 2) return v; // the end point stays inside the robot
      const amp = j < 2 ? 10 : 40;
      const nv = v + (r() - 0.5) * 2 * amp;
      return j % 2 === 1 ? clampY(nv) : nv;
    });
    // Order: one straight line from the edge into the robot, the strands almost parallel.
    const oy0 = 252 + (i * 96) / (n - 1);
    const o: Pts = [];
    for (let k = 0; k < NUMS / 2; k++) {
      const t = k / (NUMS / 2 - 1);
      o.push(sx + (CHAOS_END_X - sx) * t, oy0 + (ey - oy0) * t);
    }
    const [color, opacity] = COLORS[i % COLORS.length];
    out.push({ a, b, o, period: 7000 + r() * 3000, phase: r(), width: 2 + r() * 2, color, opacity });
  }
  return out;
}

const STRANDS = buildStrands();

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function pathD(s: Strand, clock: number, order: number): string {
  const w = 0.5 - 0.5 * Math.cos(2 * Math.PI * (clock / s.period + s.phase));
  const v = (j: number) => {
    const tangled = s.a[j] + (s.b[j] - s.a[j]) * w;
    return (tangled + (s.o[j] - tangled) * order).toFixed(1);
  };
  let d = `M${v(0)} ${v(1)}`;
  for (let j = 2; j < NUMS; j += 6) d += `C${v(j)} ${v(j + 1)} ${v(j + 2)} ${v(j + 3)} ${v(j + 4)} ${v(j + 5)}`;
  return d;
}

const media = (q: string) => typeof window !== 'undefined' && window.matchMedia(q).matches;

export function HeroOrder() {
  const { t, dir } = useLang();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [narrow, setNarrow] = useState(() => media('(max-width: 640px)'));
  const boxRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const exitRef = useRef<SVGGElement>(null);
  // Animation state lives in a ref so frames never re-render React.
  const anim = useRef({ clock: 0, order: 0, from: 0, to: 0, start: 0, dur: 0, raf: 0, last: 0, visible: true, kick: () => {}, focusOrdered: false, lastPointer: '' });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const st = anim.current;
    const box = boxRef.current;
    if (!box) return;
    const reduced = media('(prefers-reduced-motion: reduce)');
    const touch = media('(hover: none)');

    const draw = () => {
      STRANDS.forEach((s, i) => pathRefs.current[i]?.setAttribute('d', pathD(s, st.clock, st.order)));
      exitRef.current?.setAttribute('opacity', (0.78 + 0.22 * st.order).toFixed(3));
    };

    const frame = (now: number) => {
      st.raf = 0;
      const dt = Math.min(now - (st.last || now), 50);
      st.last = now;
      if (!reduced) st.clock += dt;
      let moving = false;
      if (st.order !== st.to) {
        const k = st.dur > 0 ? Math.min(1, (now - st.start) / st.dur) : 1;
        st.order = st.from + (st.to - st.from) * easeInOutCubic(k);
        if (k >= 1) st.order = st.to;
        else moving = true;
      }
      draw();
      const swaying = !reduced && st.order < 1;
      if ((moving || swaying) && st.visible && !document.hidden) st.raf = requestAnimationFrame(frame);
    };

    st.kick = () => {
      if (st.raf || !st.visible || document.hidden) return;
      st.last = 0;
      st.raf = requestAnimationFrame(frame);
    };

    let autoTimer = 0;
    let autoDone = false;
    const io = new IntersectionObserver(
      ([e]) => {
        st.visible = e.isIntersecting;
        if (st.visible) st.kick();
        if (touch && !reduced && !autoDone && e.intersectionRatio >= 0.6) {
          autoDone = true;
          autoTimer = window.setTimeout(() => setTarget(1), 800);
        }
      },
      { threshold: [0, 0.6] },
    );
    io.observe(box);
    const onVis = () => !document.hidden && st.kick();
    document.addEventListener('visibilitychange', onVis);
    st.kick();

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.clearTimeout(autoTimer);
      cancelAnimationFrame(st.raf);
      st.raf = 0;
    };
  }, []);

  function setTarget(to: number) {
    const st = anim.current;
    if (st.to === to) return;
    const reduced = media('(prefers-reduced-motion: reduce)');
    st.from = st.order;
    st.to = to;
    st.start = performance.now();
    st.dur = reduced ? 200 : (to > st.order ? 1500 : 2800) * Math.max(0.35, Math.abs(to - st.order));
    st.kick();
  }

  const onPointerEnter = (e: PointerEvent) => {
    anim.current.lastPointer = e.pointerType;
    if (e.pointerType === 'mouse' && media('(hover: hover) and (pointer: fine)')) setTarget(1);
  };
  const onPointerLeave = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && media('(hover: hover) and (pointer: fine)') && !anim.current.focusOrdered) setTarget(0);
  };
  const onPointerDown = (e: PointerEvent) => {
    anim.current.lastPointer = e.pointerType;
  };
  const onClick = () => {
    const st = anim.current;
    if (st.lastPointer === 'touch' || st.lastPointer === 'pen' || media('(hover: none)')) setTarget(st.to === 1 ? 0 : 1);
  };
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.matches(':focus-visible')) return; // a tap also focuses; only keyboard focus orders
    anim.current.focusOrdered = true;
    setTarget(1);
  };
  const onBlur = () => {
    if (!anim.current.focusOrdered) return;
    anim.current.focusOrdered = false;
    setTarget(0);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setTarget(anim.current.to === 1 ? 0 : 1);
    }
  };

  const vb = narrow ? VIEW_NARROW : VIEW_WIDE;
  const fadeW = vb.w * 0.2;
  const ids = { mask: `ho-mask-${uid}`, fade: `ho-fade-${uid}` };
  const order = anim.current.order;
  const clock = anim.current.clock;

  return (
    <div
      ref={boxRef}
      className="hero-order"
      role="img"
      aria-label={t.home.heroArt}
      tabIndex={0}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <svg viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={ids.fade} gradientUnits="userSpaceOnUse" x1={vb.x} y1="0" x2={vb.x + vb.w} y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset={fadeW / vb.w} stopColor="#fff" stopOpacity="1" />
            <stop offset={1 - fadeW / vb.w} stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={ids.mask} maskUnits="userSpaceOnUse" x={vb.x} y={vb.y} width={vb.w} height={vb.h}>
            <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill={`url(#${ids.fade})`} />
          </mask>
        </defs>
        <g mask={`url(#${ids.mask})`}>
          <g transform={dir === 'ltr' ? `matrix(-1 0 0 1 ${W} 0)` : undefined} fill="none" strokeLinecap="round">
            {STRANDS.map((s, i) => (
              <path
                key={i}
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={pathD(s, clock, order)}
                stroke={s.color}
                strokeOpacity={s.opacity}
                strokeWidth={s.width.toFixed(2)}
              />
            ))}
            <g ref={exitRef} opacity={0.78 + 0.22 * order} strokeWidth="3.5">
              <path d={`M${ORDER_START_X} ${ORDER_Y[0]}H${vb.x - 10}`} stroke="var(--navy)" />
              <path d={`M${ORDER_START_X} ${ORDER_Y[1]}H${vb.x - 10}`} stroke="var(--blue)" />
              <path d={`M${ORDER_START_X} ${ORDER_Y[2]}H${vb.x - 10}`} stroke="var(--cyan)" />
            </g>
          </g>
        </g>
        <image href={robot} x={ROBOT_X} y={ROBOT_Y} width={ROBOT_W} height={ROBOT_H} />
      </svg>
    </div>
  );
}
