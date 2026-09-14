import { useState } from "react";

/** Fixed floating widget for jumping between items (grammar lessons, kaiwa
 *  categories, ...) without scrolling back up to a top nav. `items` is
 *  [{ label, group? }] — consecutive items sharing the same `group` get a
 *  small header in the dropdown (e.g. grouping lessons under their
 *  module). `onGo` receives the new index. */
export default function FloatingNav({ items, activeIndex, onGo }) {
  const [open, setOpen] = useState(false);
  const current = items[activeIndex];
  let lastGroup;

  return (
    <div className="floatnav">
      {open && (
        <div className="floatnav-menu">
          {items.map((it, i) => {
            const showGroup = it.group && it.group !== lastGroup;
            lastGroup = it.group;
            return (
              <div key={i}>
                {showGroup && <div className="floatnav-group">{it.group}</div>}
                <button
                  className={"floatnav-item" + (i === activeIndex ? " active" : "")}
                  onClick={() => { onGo(i); setOpen(false); }}
                  title={it.label}
                >
                  <span className="floatnav-num">{i + 1}</span>
                  <span className="floatnav-item-label">{it.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
      <div className="floatnav-bar">
        <button
          className="floatnav-arrow"
          disabled={activeIndex === 0}
          onClick={() => onGo(activeIndex - 1)}
          aria-label="Previous"
        >←</button>
        <button className="floatnav-label" onClick={() => setOpen(!open)} title={current.label}>
          <span className="floatnav-count">{activeIndex + 1} / {items.length}</span>
          <span className="floatnav-title">{current.label}</span>
        </button>
        <button
          className="floatnav-arrow"
          disabled={activeIndex === items.length - 1}
          onClick={() => onGo(activeIndex + 1)}
          aria-label="Next"
        >→</button>
      </div>
    </div>
  );
}
