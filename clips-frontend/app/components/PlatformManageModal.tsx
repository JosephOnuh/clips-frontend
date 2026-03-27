"use client";

import { useState } from "react";
import { RefreshCw, Unplug, X, AlertTriangle } from "lucide-react";

interface PlatformManageModalProps {
  platform: {
    name: string;
    icon: string;
    color: string;
    textColor: string;
    handle: string;
  };
  onClose: () => void;
  onSyncNow: () => void;
  onDisconnect: () => void;
}

export default function PlatformManageModal({
  platform,
  onClose,
  onSyncNow,
  onDisconnect,
}: PlatformManageModalProps) {
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 animate-in zoom-in"
        style={{
          background: "rgba(18,18,18,0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
              style={{ background: platform.color, color: platform.textColor }}
            >
              {platform.icon}
            </span>
            <div>
              <p className="text-sm font-bold text-white">{platform.name}</p>
              <p className="text-xs text-white/35">{platform.handle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors duration-150 cursor-pointer"
            style={{ background: "rgba(255,255,255,0.06)" }}
            aria-label="Close"
          >
            <X size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
          </button>
        </div>

        {!confirmDisconnect ? (
          <div className="flex flex-col gap-2">
            {/* Sync Now */}
            <button
              onClick={() => {
                onSyncNow();
                onClose();
              }}
              className="flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-150 cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.04)";
              }}
            >
              <RefreshCw size={16} style={{ color: "#00FF9D" }} />
              <div className="text-left">
                <p className="text-sm font-semibold text-white/80">Sync Now</p>
                <p className="text-xs text-white/30">
                  Refresh account data & permissions
                </p>
              </div>
            </button>

            {/* Disconnect */}
            <button
              onClick={() => setConfirmDisconnect(true)}
              className="flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-150 cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(239,68,68,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.04)";
              }}
            >
              <Unplug size={16} style={{ color: "#EF4444" }} />
              <div className="text-left">
                <p className="text-sm font-semibold text-white/80">
                  Disconnect
                </p>
                <p className="text-xs text-white/30">
                  Remove this account from ClipCash
                </p>
              </div>
            </button>
          </div>
        ) : (
          /* Disconnect confirmation */
          <div className="flex flex-col gap-4">
            <div
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <AlertTriangle
                size={18}
                style={{ color: "#EF4444", flexShrink: 0, marginTop: 2 }}
              />
              <div>
                <p className="text-sm font-semibold text-white/90">
                  Disconnect {platform.name}?
                </p>
                <p className="text-xs text-white/40 mt-1">
                  This will revoke access and remove all scheduled posts for
                  this account. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDisconnect(false)}
                className="flex-1 text-sm font-semibold py-2 rounded-lg transition-colors duration-150 cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDisconnect();
                  onClose();
                }}
                className="flex-1 text-sm font-semibold py-2 rounded-lg transition-colors duration-150 cursor-pointer"
                style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
