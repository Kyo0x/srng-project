import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/constants';
import { api, getErrorMessage } from '@/lib/errorHandler';

export function useApi<T>(endpoint: string, opts?: { skip?: boolean }) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setData(await api<T>(endpoint));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!opts?.skip) fetchData();
  }, [endpoint, opts?.skip]);

  return { data, loading, error, refetch: fetchData };
}

export const useVehicles = () => useApi(API_ENDPOINTS.VEHICLES);
export const useBookings = () => useApi(API_ENDPOINTS.BOOKINGS);
export const useAdminStats = () => useApi(API_ENDPOINTS.ADMIN_STATS);
