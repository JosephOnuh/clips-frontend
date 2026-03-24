"use client";

import { useCallback, useEffect, useState } from "react";

export type NotificationPermission = "default" | "granted" | "denied";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission as NotificationPermission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return "denied" as NotificationPermission;
    const result = await Notification.requestPermission();
    setPermission(result as NotificationPermission);
    return result as NotificationPermission;
  }, []);

  const notify = useCallback(
    (title: string, body: string) => {
      if (permission !== "granted") return;
      new Notification(title, { body, icon: "/favicon.ico" });
    },
    [permission]
  );

  return { permission, requestPermission, notify };
}
