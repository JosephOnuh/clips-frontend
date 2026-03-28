"use client";

import React from "react";

interface StorageUsageWidgetProps {
  remainingStorage: string; // e.g., "12.4GB"
  usagePercentage: number; // percentage for the progress bar
}

export default function StorageUsageWidget({
  remainingStorage = "12.4GB",
  usagePercentage = 75,
}: StorageUsageWidgetProps) {
  const clampedUsage = Math.min(100, Math.max(0, usagePercentage));

  return (
    <div className="px-2 mb-4">
      <div className="rounded-2xl bg-[#121212] p-4 border border-white/5 relative overflow-hidden group transition-all hover:border-[#00FF9D]/30 shadow-2xl">
        {/* Subtle glow background */}
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#00FF9D]/5 blur-3xl group-hover:bg-[#00FF9D]/10 transition-colors" />
        
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
              Storage Usage
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-end justify-between">
              <span className="text-[13px] font-medium text-white">
                <span className="text-[#00FF9D] font-bold">{remainingStorage}</span> left
              </span>
              <span className="text-[11px] font-medium text-[#94A3B8]">
                {clampedUsage}%
              </span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="relative h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00FF9D]/80 to-[#00FF9D] transition-all duration-700 ease-out shadow-[0_0_12px_rgba(0,255,157,0.4)]"
                style={{ width: `${clampedUsage}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => console.log("Upgrade modal triggered")}
            className="mt-2 w-full rounded-lg bg-[#00FF9D] py-2.5 text-xs font-bold text-black transition-all hover:bg-[#00E68D] hover:shadow-[0_0_20px_rgba(0,255,157,0.25)] active:scale-[0.98]"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
