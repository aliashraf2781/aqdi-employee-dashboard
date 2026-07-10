'use client';

import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/src/utils/axios';
import { useSidebarStore } from '@/src/stores/sidebar-store';

const POLL_INTERVAL = 30_000;

const fetchUnreceivedOrdersTotal = async () => {
  const response = await axiosInstance.get('/admin/orders?is_received=false&per_page=1&page=1');
  return response?.data?.data?.pagination?.total ?? 0;
};

// Polls unreceived-orders count in the background and pops the notification
// sidebar open whenever a new one shows up (not on initial load).
export function useUnreceivedOrdersWatcher() {
  const queryClient = useQueryClient();
  const { setDisplayedPart, setSidebarOpen } = useSidebarStore();
  const previousTotalRef = useRef(null);

  const { data: total } = useQuery({
    queryKey: ['unReceivedOrdersTotal'],
    queryFn: fetchUnreceivedOrdersTotal,
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (total === undefined) return;

    const previousTotal = previousTotalRef.current;
    if (previousTotal !== null && total > previousTotal) {
      queryClient.invalidateQueries({ queryKey: ['unReceivedOrders'] });
      setSidebarOpen(true);
      setDisplayedPart('notification');
    }
    previousTotalRef.current = total;
  }, [total, queryClient, setSidebarOpen, setDisplayedPart]);

  return total ?? 0;
}
