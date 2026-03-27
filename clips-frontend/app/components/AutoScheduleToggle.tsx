"use client";

import { useState } from "react";
import { Rocket } from "lucide-react";

export default function AutoScheduleToggle() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center px-4 py-3"
      style={{
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <button
        onClick={() => setEnabled((prev) => !prev)}
        className="flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer select-none"
        style={{
          background: enabled
            ? "rgba(0,255,157,0.12)"
            : "rgba(255,255,255,0.06)",
          border: `1px solid ${enabled ? "rgba(0,255,157,0.25)" : "rgba(255,255,255,0.08)"}`,
          boxShadow: enabled
            ? "0 0 20px rgba(0,255,157,0.15)"
            : "none",
        }}
        aria-pressed={enabled}
        aria-label="Toggle auto-schedule"
      >
        <Rocket
          size={16}
          className="transition-colors duration-200"
          style={{ color: enabled ? "#00FF9D" : "rgba(255,255,255,0.35)" }}
        />

        {/* Toggle track */}
        <div
          className="relative w-9 h-5 rounded-full transition-colors duration-200"
          style={{
            background: enabled
              ? "rgba(0,255,157,0.35)"
              : "rgba(255,255,255,0.12)",
          }}
        >
          <div
            className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
            style={{
              left: enabled ? "18px" : "2px",
              background: enabled ? "#00FF9D" : "rgba(255,255,255,0.5)",
              boxShadow: enabled
                ? "0 0 8px rgba(0,255,157,0.5)"
                : "none",
            }}
          />
        </div>

        <span
          className="text-xs font-bold tracking-wider uppercase transition-colors duration-200"
          style={{ color: enabled ? "#00FF9D" : "rgba(255,255,255,0.35)" }}
        >
          Auto-Schedule {enabled ? "ON" : "OFF"}
        </span>
      </button>
    </div>
  );
}
