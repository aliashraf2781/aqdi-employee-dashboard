import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { axiosInstance } from "@/src/utils/axios";
import {
  DRAFT_ORDERS_API,
  getDraftOrdersByStatusUrl,
} from "@/src/lib/draft-contract-statuses";

const COUNT_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  retry: false,
};

const extractTotal = (response) => {
  const body = response?.data;
  return (
    body?.data?.data?.pagination?.total ??
    body?.data?.pagination?.total ??
    0
  );
};

const fetchListTotal = async (url) => {
  const response = await axiosInstance(`${url}?page=1&per_page=1`);
  return extractTotal(response);
};

export function useDraftOrderStatusCounts(statusItems = []) {
  const statusIds = useMemo(
    () => (statusItems ?? []).map((item) => item.id).filter(Boolean),
    [statusItems]
  );

  const queries = useQueries({
    queries: useMemo(
      () => [
        {
          queryKey: ["draft-order-status-count", "all"],
          queryFn: () => fetchListTotal(DRAFT_ORDERS_API),
          ...COUNT_QUERY_OPTIONS,
        },
        ...statusIds.map((id) => ({
          queryKey: ["draft-order-status-count", id],
          queryFn: () => fetchListTotal(getDraftOrdersByStatusUrl(id)),
          enabled: Boolean(id),
          ...COUNT_QUERY_OPTIONS,
        })),
      ],
      [statusIds]
    ),
  });

  const allTotal = queries[0]?.data ?? 0;
  const byId = statusIds.reduce((acc, id, index) => {
    acc[id] = queries[index + 1]?.data ?? 0;
    return acc;
  }, {});

  const isLoading = queries.some((query) => query.isLoading);

  return { allTotal, byId, isLoading };
}
