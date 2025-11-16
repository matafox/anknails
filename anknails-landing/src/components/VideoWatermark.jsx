// src/components/VideoWatermark.jsx
import React, { useMemo } from "react";

/**
 * Легкий водяний знак поверх відео (iframe).
 * Показує повторюваний текст діагональними стрічками.
 * props:
 *  - text: рядок (наприклад: "Ім'я · email")
 *  - strong: зробити помітнішим (опц.)
 */
export default function VideoWatermark({ text = "", strong = false }) {
  const label = useMemo(() => (text || "").trim() || "ANK Studio", [text]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 select-none"
      aria-hidden
    >
      <div className="absolute -inset-10 -rotate-[18deg] opacity-100">
        {/* Дві паралельні «бігові» доріжки для ефекту повтору */}
        <div className={`wm-row ${strong ? "wm-strong" : "wm-soft"}`} style={{ animationDelay: "0s" }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={`a-${i}`} className="wm-chip">{label}</span>
          ))}
        </div>
        <div className={`wm-row ${strong ? "wm-strong" : "wm-soft"}`} style={{ animationDelay: "10s" }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={`b-${i}`} className="wm-chip">{label}</span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes wm-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .wm-row {
          white-space: nowrap;
          animation: wm-marquee 22s linear infinite;
          user-select: none;
        }
        .wm-chip {
          display: inline-block;
          margin: 0 22px;
          padding: 2px 0;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: .06em;
          text-transform: none;
          text-shadow: 0 0 1px rgba(0,0,0,.12);
        }
        .wm-soft   { opacity: .16; mix-blend-mode: multiply; }
        .wm-strong { opacity: .30; mix-blend-mode: multiply; }
        @media (prefers-color-scheme: dark) {
          .wm-soft, .wm-strong { mix-blend-mode: screen; }
        }
      `}</style>
    </div>
  );
}
