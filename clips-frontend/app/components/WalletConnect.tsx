"use client";

import { useState, useCallback } from "react";
import { Wallet, Check, Loader2 } from "lucide-react";

interface WalletState {
  phantom: { connected: boolean; address: string | null };
  metamask: { connected: boolean; address: string | null };
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function WalletConnect() {
  const [wallets, setWallets] = useState<WalletState>({
    phantom: { connected: false, address: null },
    metamask: { connected: false, address: null },
  });
  const [loading, setLoading] = useState<string | null>(null);

  const connectPhantom = useCallback(async () => {
    try {
      setLoading("phantom");
      const provider = (window as unknown as Record<string, unknown>)
        .solana as {
        isPhantom?: boolean;
        connect: () => Promise<{ publicKey: { toString: () => string } }>;
      } | undefined;

      if (!provider?.isPhantom) {
        window.open("https://phantom.app/", "_blank");
        setLoading(null);
        return;
      }

      const resp = await provider.connect();
      const address = resp.publicKey.toString();
      setWallets((prev) => ({
        ...prev,
        phantom: { connected: true, address },
      }));
    } catch {
      // User rejected or error
    } finally {
      setLoading(null);
    }
  }, []);

  const connectMetaMask = useCallback(async () => {
    try {
      setLoading("metamask");
      const ethereum = (window as unknown as Record<string, unknown>)
        .ethereum as {
        isMetaMask?: boolean;
        request: (args: { method: string }) => Promise<string[]>;
      } | undefined;

      if (!ethereum?.isMetaMask) {
        window.open("https://metamask.io/download/", "_blank");
        setLoading(null);
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts[0]) {
        setWallets((prev) => ({
          ...prev,
          metamask: { connected: true, address: accounts[0] },
        }));
      }
    } catch {
      // User rejected or error
    } finally {
      setLoading(null);
    }
  }, []);

  return (
    <div
      className="w-full max-w-xl rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Wallet size={16} style={{ color: "#00FF9D" }} />
        <h2
          className="text-base font-bold text-white"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Wallet
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {/* Phantom (Solana) */}
        {wallets.phantom.connected ? (
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              background: "rgba(0,255,157,0.06)",
              border: "1px solid rgba(0,255,157,0.12)",
            }}
          >
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: "#AB9FF2", color: "#fff" }}
            >
              PH
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white/80">Phantom</p>
              <p className="text-xs text-white/40 font-mono truncate">
                {shortenAddress(wallets.phantom.address!)}
              </p>
            </div>
            <span
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{
                background: "rgba(0,255,157,0.12)",
                color: "#00FF9D",
              }}
            >
              <Check size={12} />
              Linked
            </span>
          </div>
        ) : (
          <button
            onClick={connectPhantom}
            disabled={loading === "phantom"}
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-150 cursor-pointer w-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(171,159,242,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(171,159,242,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.06)";
            }}
          >
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: "#AB9FF2", color: "#fff" }}
            >
              PH
            </span>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-white/80">
                Phantom
              </p>
              <p className="text-xs text-white/30">Solana</p>
            </div>
            {loading === "phantom" ? (
              <Loader2
                size={16}
                className="animate-spin"
                style={{ color: "rgba(255,255,255,0.4)" }}
              />
            ) : (
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{
                  background: "rgba(171,159,242,0.12)",
                  color: "#AB9FF2",
                }}
              >
                Connect
              </span>
            )}
          </button>
        )}

        {/* MetaMask (EVM) */}
        {wallets.metamask.connected ? (
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              background: "rgba(0,255,157,0.06)",
              border: "1px solid rgba(0,255,157,0.12)",
            }}
          >
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: "#F6851B", color: "#fff" }}
            >
              MM
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white/80">MetaMask</p>
              <p className="text-xs text-white/40 font-mono truncate">
                {shortenAddress(wallets.metamask.address!)}
              </p>
            </div>
            <span
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{
                background: "rgba(0,255,157,0.12)",
                color: "#00FF9D",
              }}
            >
              <Check size={12} />
              Linked
            </span>
          </div>
        ) : (
          <button
            onClick={connectMetaMask}
            disabled={loading === "metamask"}
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-150 cursor-pointer w-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(246,133,27,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(246,133,27,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.06)";
            }}
          >
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: "#F6851B", color: "#fff" }}
            >
              MM
            </span>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-white/80">
                MetaMask
              </p>
              <p className="text-xs text-white/30">Ethereum / EVM</p>
            </div>
            {loading === "metamask" ? (
              <Loader2
                size={16}
                className="animate-spin"
                style={{ color: "rgba(255,255,255,0.4)" }}
              />
            ) : (
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{
                  background: "rgba(246,133,27,0.12)",
                  color: "#F6851B",
                }}
              >
                Connect
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
