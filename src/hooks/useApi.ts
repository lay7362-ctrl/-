import { useState, useEffect, useCallback } from "react";
import type { ApiResponse } from "@/types";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  deps: unknown[] = []
): UseApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetcher();
      if (res.success) {
        setState({ data: res.data ?? null, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: res.error ?? "Unknown error" });
      }
    } catch {
      setState({ data: null, loading: false, error: "Network error" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}

export function useMutation<TData, TVariables>(
  mutator: (variables: TVariables) => Promise<ApiResponse<TData>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await mutator(variables);
        if (res.success) {
          return res.data ?? null;
        }
        setError(res.error ?? "Unknown error");
        return null;
      } catch {
        setError("Network error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [mutator]
  );

  return { mutate, loading, error };
}
