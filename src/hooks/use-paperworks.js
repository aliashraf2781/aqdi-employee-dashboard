"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/src/utils/axios";

function normalizePaperworks(response) {
  const payload = response?.data ?? response;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

async function fetchPaperworks(contractType) {
  const res = await axiosInstance.get("/admin/paperworks", {
    params: {
      contract_type: contractType,
      per_page: 100,
    },
  });
  return normalizePaperworks(res.data);
}

export function usePaperworks(contractType, enabled = true) {
  const query = useQuery({
    queryKey: ["paperworks", contractType],
    queryFn: () => fetchPaperworks(contractType),
    enabled: enabled && !!contractType,
    staleTime: 60_000,
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
  };
}
