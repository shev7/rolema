"use client";

import { useCallback, useState } from "react";

type UseMutationReturn<TVariables, TData> = {
  data?: TData;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  mutate(variables: TVariables): Promise<TData | undefined>;
};

type MutationOptions<TVariables, TData> = {
  onSuccess?(data: TData, variables: TVariables): void;
  onError?(error: Error, variables: TVariables): void;
  onFinally?(): void;
};

export const useMutation = <TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: MutationOptions<TVariables, TData>,
): UseMutationReturn<TVariables, TData> => {
  const [data, setData] = useState<TData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true);
      try {
        const data = await mutationFn(variables);
        options?.onSuccess?.(data, variables);
        setData(data);

        return data;
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
          options?.onError?.(error, variables);
        }
      } finally {
        options?.onFinally?.();
        setIsLoading(false);
      }
    },
    [options],
  );

  return {
    mutate,
    isLoading,
    error,
    isError: Boolean(error),
    data,
  };
};
