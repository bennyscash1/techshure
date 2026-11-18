import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';

/** True when the visitor asked the OS for less motion. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Elements that fade and slide up as they scroll into view.
const REVEAL_SELECTOR = [
  'main h2',
  'main h3',
  'main p',
  'main .kicker',
  'main .card',
  'main .pain',
  'main .module',
  'main .term',
  'main .ticks > li',
  'main .product-row-media img',
  'main .price-box',
  'main .refer',
  'main .form',
  'main .jump',
  'main .launch-banner',
  'main .custom-links',
  'main .hero-actions',
].join(',');

// Items in a list cascade a little slower than sibling text blocks.
const STAGGER_PARENTS = new Set(['UL', 'OL']);
const LIST_STEP_MS = 110;
const TEXT_STEP_MS = 120;

/**
 * Marks text and cards inside <main> for a staggered slide-up reveal and plays it once each
 * element enters the viewport. Runs again on every route change.
 * Plays with reduced motion too: the CSS shortens the slide there instead of removing it.
 */
export function useScrollReveal(routeKey: string) {
  useLayoutEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const els: HTMLElement[] = [];

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.classList.add('is-in');
          io.unobserve(target);
          // Drop the stagger once played, so hover effects respond at once.
          window.setTimeout(() => target.style.removeProperty('--reveal-delay'), 1800);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    // Counts revealed siblings per parent, so a heading, its text and its buttons follow one another.
    const seen = new Map<Element, number>();

    // Document order puts parents first, so matches nested in a revealed block are skipped.
    for (const el of Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))) {
      // The hero copy has its own entrance.
      if (el.closest('.hero-copy, .page-hero, .no-reveal') || el.parentElement?.closest('[data-reveal]')) continue;
      els.push(el);
      el.setAttribute('data-reveal', '');
      const parent = el.parentElement;
      if (parent) {
        const isList = STAGGER_PARENTS.has(parent.tagName);
        const index = isList ? (Array.prototype.indexOf.call(parent.children, el) as number) : (seen.get(parent) ?? 0);
        seen.set(parent, index + 1);
        const delay = `${Math.min(index, 6) * (isList ? LIST_STEP_MS : TEXT_STEP_MS)}ms`;
        el.style.setProperty('--reveal-delay', delay);
        el.style.setProperty('--stagger', delay);
      }
      io.observe(el);
    }

    return () => {
      io.disconnect();
      for (const el of els) {
        el.removeAttribute('data-reveal');
        el.classList.remove('is-in');
        el.style.removeProperty('--reveal-delay');
        el.style.removeProperty('--stagger');
      }
    };
  }, [routeKey]);
}

/** Splits a headline into words that rise one after the other. */
export function SplitWords({ text, start = 0, className }: { text: string; start?: number; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word" style={{ '--i': start + i } as CSSProperties}>{w}</span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  );
}

/** Counts up to a number when it scrolls into view. */
export function CountUp({ value, format = (n) => n.toLocaleString('en-US'), duration = 1100 }: { value: number; format?: (n: number) => string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    setShown(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="count-up">
      {/* Screen readers get the final value straight away. */}
      <span aria-hidden="true">{format(shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}

const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** A card that tilts in 3D toward the pointer and shows a soft light spot. */
export function TiltCard({ children, className = '', max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || !canHover() || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * max}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * max}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.classList.add('is-tilting');
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.classList.remove('is-tilting');
  }

  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}

/** Tracks the pointer inside a grid so each card can light up where the cursor is. */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || !canHover()) return;
    const onMove = (e: globalThis.PointerEvent) => {
      for (const card of Array.from(root.children) as HTMLElement[]) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--sx', `${e.clientX - r.left}px`);
        card.style.setProperty('--sy', `${e.clientY - r.top}px`);
      }
    };
    root.addEventListener('pointermove', onMove);
    return () => root.removeEventListener('pointermove', onMove);
  }, []);
  return ref;
}

/** Moves layers of an element by pointer position and scroll, for a light parallax. */
export function useParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      raf = 0;
      const sy = Math.min(window.scrollY, 600);
      el.style.setProperty('--px', px.toFixed(3));
      el.style.setProperty('--py', py.toFixed(3));
      el.style.setProperty('--scroll', String(sy));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onPointer = (e: globalThis.PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
      queue();
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', queue, { passive: true });
    queue();
    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', queue);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

/** Writes scroll progress (0 to 1) to --progress on the element, for the header progress bar. */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty('--progress', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0');
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    apply();
    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}
