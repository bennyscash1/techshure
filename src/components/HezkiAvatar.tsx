import { useId } from 'react';

/**
 * Hezki, the Tech-shure robot, drawn as a small animated SVG.
 * Eyes open on mount and blink, the head floats and tilts, and it "talks" while typing.
 * All motion lives in CSS (.hezki rules in styles.css). Under prefers-reduced-motion only the float and tilt stop.
 */
export function HezkiAvatar({ size = 56, typing = false, className = '' }: { size?: number; typing?: boolean; className?: string }) {
  // Unique gradient ids, so several avatars on the page never share one.
  const uid = useId().replace(/:/g, '');
  const headId = `hz-head-${uid}`;
  const irisId = `hz-iris-${uid}`;
  return (
    <svg
      className={`hezki${typing ? ' is-typing' : ''} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={headId} cx="40%" cy="32%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#eef3fa" />
          <stop offset="1" stopColor="#cfdcee" />
        </radialGradient>
        <radialGradient id={irisId} cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#5fd6f2" />
          <stop offset="1" stopColor="#1e7fd6" />
        </radialGradient>
      </defs>

      <ellipse className="hz-shadow" cx="60" cy="112" rx="26" ry="4" fill="#16295a" opacity="0.14" />

      <g className="hz-float">
        <g className="hz-head">
          {/* antenna */}
          <path d="M60 18 V8" stroke="#16295a" strokeWidth="3.5" strokeLinecap="round" />
          <circle className="hz-antenna" cx="60" cy="7" r="4.5" fill="#19c3e6" />

          {/* headset band, behind the head */}
          <path d="M22 60 A38 40 0 0 1 98 60" fill="none" stroke="#16295a" strokeWidth="5" strokeLinecap="round" opacity="0.9" />

          {/* head */}
          <circle cx="60" cy="60" r="41" fill={`url(#${headId})`} stroke="#d5e0ef" strokeWidth="1" />
          {/* cap */}
          <path d="M24 42 A41 41 0 0 1 96 42 Q60 28 24 42 Z" fill="#16295a" />

          {/* brows */}
          <g className="hz-brows" stroke="#16295a" strokeWidth="3.2" strokeLinecap="round" fill="none">
            <path d="M37 45 Q44 41 51 44" />
            <path d="M69 44 Q76 41 83 45" />
          </g>

          {/* eyes */}
          <g className="hz-eyes">
            <g className="hz-eye">
              <ellipse cx="44" cy="57" rx="9.5" ry="10.5" fill="#fff" stroke="#c9d6ea" strokeWidth="1" />
              <g className="hz-look">
                <circle cx="44" cy="58" r="6.6" fill={`url(#${irisId})`} />
                <circle cx="44" cy="58" r="3.2" fill="#0e1c40" />
                <circle cx="46.2" cy="55.6" r="1.8" fill="#fff" />
              </g>
            </g>
            <g className="hz-eye">
              <ellipse cx="76" cy="57" rx="9.5" ry="10.5" fill="#fff" stroke="#c9d6ea" strokeWidth="1" />
              <g className="hz-look">
                <circle cx="76" cy="58" r="6.6" fill={`url(#${irisId})`} />
                <circle cx="76" cy="58" r="3.2" fill="#0e1c40" />
                <circle cx="78.2" cy="55.6" r="1.8" fill="#fff" />
              </g>
            </g>
          </g>

          {/* face panel and smile */}
          <path d="M28 72 Q60 64 92 72 Q92 94 60 98 Q28 94 28 72 Z" fill="#16295a" />
          <path className="hz-smile" d="M49 82 Q60 90 71 82" stroke="#19c3e6" strokeWidth="3" strokeLinecap="round" fill="none" />
          <g className="hz-talk" fill="#19c3e6">
            <circle cx="51" cy="84" r="2.6" />
            <circle cx="60" cy="84" r="2.6" />
            <circle cx="69" cy="84" r="2.6" />
          </g>

          {/* ear piece and mic */}
          <rect x="94" y="50" width="10" height="20" rx="5" fill="#16295a" />
          <rect className="hz-ear-light" x="101" y="54" width="2.4" height="12" rx="1.2" fill="#19c3e6" />
          <path d="M99 70 Q96 84 82 88" fill="none" stroke="#16295a" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="81" cy="88" r="2.8" fill="#19c3e6" />
        </g>
      </g>
    </svg>
  );
}
