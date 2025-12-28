import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import { ApiResponse, PaginationParams } from '@/types/api';
import { getErrorMessage } from '@/lib/errors';
import { toast } from 'sonner';

// Generic API hook return type
interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
}

// Hook for GET requests
export function useApi<T = any>(
  url: string,
  params?: PaginationParams,
  immediate = true
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<T>(url, {
        params,
        signal: abortControllerRef.current.signal,
      });
      
      setData(response.data);
    } catch (err: any) {
      if (err.name !== 'CanceledError') {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        
        // Show toast for errors (optional)
        if (err.isServerError() || err.isNetworkError()) {
          toast.error(errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [url, params]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
  }, []);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, immediate]);

  return { data, loading, error, refetch, mutate };
}

// Hook for mutations (POST, PUT, DELETE)
export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: any) => void;
    showToast?: boolean;
  }
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (variables: TVariables) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mutationFn(variables);
      
      if (options?.onSuccess) {
        options.onSuccess(response.data);
      }
      
      if (options?.showToast !== false) {
        toast.success('Operation completed successfully');
      }
      
      return response.data;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      if (options?.onError) {
        options.onError(err);
      }
      
      if (options?.showToast !== false) {
        toast.error(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn, options]);

  return { mutate, loading, error };
}

// Hook for paginated data
export function usePaginatedApi<T = any>(
  baseUrl: string,
  initialParams: PaginationParams = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrevious: false,
  });
  const [params, setParams] = useState<PaginationParams>(initialParams);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<T[]>(baseUrl, {
        params: { ...params, page: pagination.currentPage },
      });
      
      setData(response.data);
      
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, params, pagination.currentPage]);

  const nextPage = useCallback(() => {
    if (pagination.hasNext) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  }, [pagination.hasNext]);

  const previousPage = useCallback(() => {
    if (pagination.hasPrevious) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  }, [pagination.hasPrevious]);

  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  const updateParams = useCallback((newParams: PaginationParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    params,
    nextPage,
    previousPage,
    goToPage,
    updateParams,
    refetch: fetchData,
  };
}

// Hook for real-time data polling
export function usePollingApi<T = any>(
  url: string,
  interval: number = 30000, // 30 seconds default
  params?: PaginationParams
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<T>(url, { params });
      setData(response.data);
      setError(null);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [url, params]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(fetchData, interval);
  }, [fetchData, interval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchData(); // Initial fetch
    startPolling();

    return stopPolling; // Cleanup
  }, [fetchData, startPolling, stopPolling]);

  return { data, loading, error, startPolling, stopPolling, refetch: fetchData };
}

// Hook for file upload
export function useFileUpload() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const uploadFile = useCallback(async (
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.upload(url, formData, {
        onUploadProgress: (progressEvent) => {
          const progressPercent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(progressPercent);
          if (onProgress) {
            onProgress(progressPercent);
          }
        },
      });

      setProgress(100);
      toast.success('File uploaded successfully');
      return response.data;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, []);

  return { uploadFile, loading, error, progress };
}

// Hook for caching API responses
export function useCachedApi<T = any>(
  key: string,
  fetcher: () => Promise<ApiResponse<T>>,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    const cached = localStorage.getItem(`cache_${key}`);
    const cachedTime = localStorage.getItem(`cache_${key}_time`);
    
    // Check if cache is valid
    if (!forceRefresh && cached && cachedTime) {
      const age = Date.now() - parseInt(cachedTime);
      if (age < ttl) {
        setData(JSON.parse(cached));
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetcher();
      
      // Cache the response
      localStorage.setItem(`cache_${key}`, JSON.stringify(response.data));
      localStorage.setItem(`cache_${key}_time`, Date.now().toString());
      
      setData(response.data);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl]);

  const invalidateCache = useCallback(() => {
    localStorage.removeItem(`cache_${key}`);
    localStorage.removeItem(`cache_${key}_time`);
  }, [key]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: () => fetchData(true), invalidateCache };
}
