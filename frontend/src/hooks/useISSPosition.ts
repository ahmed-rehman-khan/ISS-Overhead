"use client";

import { useState, useEffect, useCallback } from "react";
import { getISSPosition, ISSPosition } from "@/lib/api";

const POLL_INTERVAL_MS = 5000;

export function useISSPosition() {
  const [position, setPosition] = useState<ISSPosition | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);

  const fetchPosition = useCallback(async () => {
    try {
      const data = await getISSPosition();
      setPosition(data);
      setError(null);
    } catch {
      setError("Could not reach the ISS API. Retrying...");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosition();
    const interval = setInterval(fetchPosition, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchPosition]);

  return { position, error, loading };
}
