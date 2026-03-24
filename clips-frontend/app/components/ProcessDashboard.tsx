"use client";

import { useEffect, useRef } from "react";
import { useProcessStore, ProcessState } from "../hooks/useProcessStore";
import { useNotifications } from "../hooks/useNotifications";

export default function ProcessDashboard() {
  const { process, update, startProcess, resetProcess } = useProcessStore();
  const { permission, requestPermission, notify } = useNotifications();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifiedRef = useRef(false);

  // Resume simulated polling if a process is active on mount
  useEffect(() => {
    if (process.status === "processing") {
      notifiedRef.current = false;
      intervalRef.current = setInterval(() => {
        update((prev: ProcessState) => ({ progress: Math.min(prev.progress + 5, 100) }));
      }, 800);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [process.status === "processing" && process.id]);

  // Watch for completion
  useEffect(() => {
    if (process.progress >= 100 && process.status === "processing") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      update({ status: "complete", progress: 100, completedAt: Date.now() });
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        notify("Clips — Processing Complete", `"${process.label}" is ready.`);
      }
    }
  }, [process.progress, process.status, process.label, update, notify]);

  function handleStart() {
    const id = crypto.randomUUID();
    startProcess(id, "My Clip Export");
    notifiedRef.current = false;
    intervalRef.current = setInterval(() => {
      update((prev: ProcessState) => ({ progress: Math.min(prev.progress + 5, 100) }));
    }, 800);
  }

  const isIdle = process.status === "idle";
  const isProcessing = process.status === "processing";
  const isComplete = process.status === "complete";

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
          Background Processing
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
          Processing continues even if you navigate away. Come back anytime to
          check progress.
        </p>

        {/* Progress bar */}
        {!isIdle && (
          <div className="mb-5">
            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              <span>{process.label}</span>
              <span>{process.progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${process.progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
              {isProcessing && "Processing in background — feel free to navigate away."}
              {isComplete && "Done! Your clip is ready."}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          {isIdle && (
            <button
              onClick={handleStart}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Start Processing
            </button>
          )}
          {(isProcessing || isComplete) && (
            <button
              onClick={resetProcess}
              className="rounded-full border border-zinc-300 dark:border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Notification opt-in */}
      {permission !== "granted" && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm flex items-center justify-between gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Get notified when processing completes.
          </p>
          <button
            onClick={requestPermission}
            disabled={permission === "denied"}
            className="shrink-0 rounded-full bg-zinc-900 dark:bg-zinc-50 px-4 py-1.5 text-sm font-medium text-white dark:text-zinc-900 hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {permission === "denied" ? "Blocked" : "Enable Notifications"}
          </button>
        </div>
      )}
    </div>
  );
}
