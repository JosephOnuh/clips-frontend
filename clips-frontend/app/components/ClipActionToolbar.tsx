"use client";

import { useState } from "react";
import { Pencil, Download } from "lucide-react";

interface ClipActionToolbarProps {
  onEdit?: () => void;
  onDownload?: () => void;
  onPreview?: () => void;
}

export default function ClipActionToolbar({
  onEdit,
  onDownload,
  onPreview,
}: ClipActionToolbarProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  return (
    <div
      className="flex items-center justify-between w-full px-3 py-2 rounded-xl mt-2"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Left: Edit + Download */}
      <div className="flex items-center gap-1">
        <div className="relative">
          <button
            onClick={onEdit}
            onMouseEnter={() => setTooltip("edit")}
            onMouseLeave={() => setTooltip(null)}
            className="p-2 rounded-lg transition-all duration-150 cursor-pointer"
            style={{
              background:
                tooltip === "edit"
                  ? "rgba(255,255,255,0.06)"
                  : "transparent",
            }}
            aria-label="Edit clip"
          >
            <Pencil size={15} style={{ color: "rgba(255,255,255,0.5)" }} />
          </button>
          {tooltip === "edit" && (
            <span
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-medium px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
              style={{
                background: "rgba(0,0,0,0.85)",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Edit
            </span>
          )}
        </div>

        <div className="relative">
          <button
            onClick={onDownload}
            onMouseEnter={() => setTooltip("download")}
            onMouseLeave={() => setTooltip(null)}
            className="p-2 rounded-lg transition-all duration-150 cursor-pointer"
            style={{
              background:
                tooltip === "download"
                  ? "rgba(255,255,255,0.06)"
                  : "transparent",
            }}
            aria-label="Download clip"
          >
            <Download size={15} style={{ color: "rgba(255,255,255,0.5)" }} />
          </button>
          {tooltip === "download" && (
            <span
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-medium px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
              style={{
                background: "rgba(0,0,0,0.85)",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Download
            </span>
          )}
        </div>
      </div>

      {/* Right: Preview link */}
      <button
        onClick={onPreview}
        className="text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer"
        style={{ color: "#00FF9D" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#88FFD9";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#00FF9D";
        }}
      >
        PREVIEW &gt;
      </button>
    </div>
  );
}
