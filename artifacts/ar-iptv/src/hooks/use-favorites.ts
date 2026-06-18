import { useCallback, useEffect, useState } from "react";

const FAVORITES_STORAGE_KEY = "iptv-viewer-favorites";
const RECENT_STORAGE_KEY = "iptv-viewer-history";
const MAX_RECENT_ITEMS = 12;

function readStoredValue(key: string) {
  if (typeof window === "undefined") return null;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const stored = readStoredValue(FAVORITES_STORAGE_KEY);
    if (Array.isArray(stored)) {
      setFavorites(stored.filter((value) => typeof value === "number"));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((channelId: number) => {
    setFavorites((prev) => {
      const isFavorite = prev.includes(channelId);
      return isFavorite ? prev.filter((id) => id !== channelId) : [channelId, ...prev];
    });
  }, []);

  const isFavorite = useCallback(
    (channelId: number) => favorites.includes(channelId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}

export function useRecentWatch() {
  const [recent, setRecent] = useState<number[]>([]);

  useEffect(() => {
    const stored = readStoredValue(RECENT_STORAGE_KEY);
    if (Array.isArray(stored)) {
      setRecent(stored.filter((value) => typeof value === "number"));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recent));
  }, [recent]);

  const markWatched = useCallback((channelId: number) => {
    setRecent((prev) => {
      const next = [channelId, ...prev.filter((id) => id !== channelId)];
      return next.slice(0, MAX_RECENT_ITEMS);
    });
  }, []);

  return { recent, markWatched };
}
