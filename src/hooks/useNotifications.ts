import { useState, useEffect, useCallback } from "react";

const NOTIF_KEY = "notifications_last_seen";

export function useNotifications() {
  const [hasUnread, setHasUnread] = useState(() => {
    const lastSeen = localStorage.getItem(NOTIF_KEY);
    return !lastSeen;
  });

  const markAsSeen = useCallback(() => {
    localStorage.setItem(NOTIF_KEY, Date.now().toString());
    setHasUnread(false);
  }, []);

  // Listen for storage changes (cross-tab)
  useEffect(() => {
    const handler = () => {
      const lastSeen = localStorage.getItem(NOTIF_KEY);
      setHasUnread(!lastSeen);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return { hasUnread, markAsSeen };
}
