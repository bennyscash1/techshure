import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon, type IconName } from './Icon';

export type TabDef = { id: string; label: string; icon: IconName; content: ReactNode };

/**
 * Accessible tabs (WAI-ARIA tabs pattern, automatic activation), deep-linkable through ?tab=<id>.
 * The URL is updated with replace, so tab clicks do not fill the browser history.
 * All panels stay in the DOM (hidden), so the scroll reveal can pick up their content.
 */
export function Tabs({ tabs, label }: { tabs: TabDef[]; label: string }) {
  const [params, setParams] = useSearchParams();
  const requested = params.get('tab');
  const active = tabs.some((t) => t.id === requested) ? (requested as string) : tabs[0].id;
  const base = useId().replace(/:/g, '');
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  // Keep the active tab visible inside the scrollable bar (mobile), without moving the page.
  useEffect(() => {
    const el = refs.current[tabs.findIndex((t) => t.id === active)];
    const list = el?.parentElement;
    if (!el || !list || list.scrollWidth <= list.clientWidth) return;
    const a = el.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    list.scrollBy({ left: a.left + a.width / 2 - (b.left + b.width / 2), behavior: 'smooth' });
  }, [active, tabs]);

  function select(id: string, focus = false, toTop = false) {
    const next = new URLSearchParams(params);
    if (id === tabs[0].id) next.delete('tab');
    else next.set('tab', id);
    setParams(next, { replace: true, preventScrollReset: true });
    const i = tabs.findIndex((t) => t.id === id);
    const el = refs.current[i];
    if (el) {
      if (focus) el.focus({ preventScroll: true });
    }
    // When the tab bar is stuck under the header, or the switch came from the bottom of a panel,
    // bring the start of the new panel into view instead of leaving the reader mid-page.
    const root = rootRef.current;
    if (root) {
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
      const top = root.getBoundingClientRect().top;
      if (toTop || top < header) window.scrollTo({ top: window.scrollY + top - header - 12, behavior: 'smooth' });
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    // In RTL the next tab sits to the left.
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = rtl ? 'ArrowRight' : 'ArrowLeft';
    let to = -1;
    if (e.key === forward) to = (i + 1) % tabs.length;
    else if (e.key === back) to = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = tabs.length - 1;
    if (to < 0) return;
    e.preventDefault();
    select(tabs[to].id, true);
  }

  return (
    <div className="tabs" ref={rootRef}>
      <div className="tab-bar">
        <div className="tab-list" role="tablist" aria-label={label}>
          {tabs.map((t, i) => {
            const selected = t.id === active;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${base}-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`${base}-panel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                className={`tab${selected ? ' is-active' : ''}`}
                onClick={() => select(t.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <Icon name={t.icon} size={18} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          tabIndex={0}
          hidden={t.id !== active}
          className="tab-panel"
        >
          {t.content}
          {i < tabs.length - 1 && (
            <p className="tab-next">
              <button type="button" className="text-link" onClick={() => select(tabs[i + 1].id, true, true)}>
                הנושא הבא: {tabs[i + 1].label} <Icon name="arrow" size={16} />
              </button>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
