
import { useState, useEffect, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  retries?: number;
  timeout?: number;
}

export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
) {
  const { immediate = true, retries = 3, timeout = 10000 } = options;
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const fetchData = useCallback(async (retryCount = 0) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api${url}`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setState({
        data: result.data || result,
        loading: false,
        error: null
      });
    } catch (error) {
      if (retryCount < retries) {
        // Exponential backoff
        setTimeout(() => fetchData(retryCount + 1), Math.pow(2, retryCount) * 1000);
        return;
      }

      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  }, [url, retries, timeout]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  const refetch = useCallback(() => fetchData(), [fetchData]);

  return {
    ...state,
    refetch
  };
}

export function useApiMutation<T, P = any>() {
  const [state, setState] = useState<ApiState<T> & { isSubmitting: boolean }>({
    data: null,
    loading: false,
    error: null,
    isSubmitting: false
  });

  const mutate = useCallback(async (url: string, payload: P, method = 'POST') => {
    setState(prev => ({ ...prev, isSubmitting: true, loading: true, error: null }));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api${url}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setState({
        data: result.data || result,
        loading: false,
        error: null,
        isSubmitting: false
      });

      return result;
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        isSubmitting: false
      });
      throw error;
    }
  }, []);

  return {
    ...state,
    mutate
  };
}
