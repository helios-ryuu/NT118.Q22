// Hook lay du lieu tu API — thay the pattern useState + useEffect + loading
import { useEffect, useRef, useState } from "react";
import { api } from "@/services/api";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFetchOptions {
  enabled?: boolean;
  onError?: (error: Error) => void;
}

export function useFetch<T>(path: string | null, options?: UseFetchOptions): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dung ref cho callback de tranh options object vao dependency array
  const onErrorRef = useRef(options?.onError);
  useEffect(() => { onErrorRef.current = options?.onError; });

  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!path || !enabled) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    api.get<T>(path)
      .then(setData)
      .catch((e: unknown) => {
        const err = e instanceof Error ? e : new Error("Fetch failed");
        setError(err.message);
        onErrorRef.current?.(err);
        console.error("[useFetch]", path, err);
      })
      .finally(() => setLoading(false));
  }, [path, enabled]); // options bi loai khoi deps de tranh infinite refetch

  return { data, loading, error };
}
