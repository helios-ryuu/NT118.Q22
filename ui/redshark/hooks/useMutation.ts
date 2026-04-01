import { useCallback, useRef, useState } from "react";

interface MutationState<TData> {
  loading: boolean;
  data: TData | null;
  error: string | null;
}

interface MutationOptions<TData> {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

export function useMutation<TArgs extends unknown[], TData>(
  mutationFn: (...args: TArgs) => Promise<TData>,
  options?: MutationOptions<TData>,
) {
  const [state, setState] = useState<MutationState<TData>>({
    loading: false,
    data: null,
    error: null,
  });

  // Sync options moi nhat vao ref de tranh stale closure khi options thay doi
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const mutate = useCallback(async (...args: TArgs): Promise<TData> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await mutationFn(...args);
      setState({ loading: false, data, error: null });
      optionsRef.current?.onSuccess?.(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Mutation failed");
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      optionsRef.current?.onError?.(error);
      throw error;
    }
  }, [mutationFn]); // options khong can trong deps vi dung ref

  const reset = useCallback(() => {
    setState({ loading: false, data: null, error: null });
  }, []);

  return { ...state, mutate, reset };
}
