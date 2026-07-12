'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/src/utils/axios';
import { isOrdersRelatedPath } from '@/src/lib/order-routes';
import { useSidebarStore } from '@/src/stores/sidebar-store';

const POLL_INTERVAL = 30_000;

const fetchUnreceivedOrdersTotal = async () => {
  const response = await axiosInstance.get('/admin/orders?is_received=false&per_page=1&page=1');
  return response?.data?.data?.pagination?.total ?? 0;
};

function openNotificationsSidebar({ queryClient, setSidebarOpen, setDisplayedPart }) {
  queryClient.invalidateQueries({ queryKey: ['unReceivedOrders'] });
  setSidebarOpen(true);
  setDisplayedPart('notification');
}

// Polls unreceived-orders count in the background and opens the notification
// sidebar when entering orders-related pages or when a new order arrives.
export function useUnreceivedOrdersWatcher() {
  const pathname = usePathname();
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
    if (!isOrdersRelatedPath(pathname) || total === undefined || total <= 0) return;

    openNotificationsSidebar({ queryClient, setSidebarOpen, setDisplayedPart });
  }, [pathname, total, queryClient, setSidebarOpen, setDisplayedPart]);

  useEffect(() => {
    if (total === undefined) return;

    const previousTotal = previousTotalRef.current;
    if (previousTotal !== null && total > previousTotal) {
      openNotificationsSidebar({ queryClient, setSidebarOpen, setDisplayedPart });
    }
    previousTotalRef.current = total;
  }, [total, queryClient, setSidebarOpen, setDisplayedPart]);

  return total ?? 0;
}
