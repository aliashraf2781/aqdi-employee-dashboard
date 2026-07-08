"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/src/utils/axios";

function normalizePaymentTypes(response) {
  const payload = response?.data ?? response;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

async function fetchPaymentTypes(contractType) {
  const res = await axiosInstance.get("/admin/payment-types", {
    params: {
      contract_type: contractType,
      per_page: 100,
    },
  });
  return normalizePaymentTypes(res.data);
}

export function usePaymentTypes(contractType, enabled = true) {
  const query = useQuery({
    queryKey: ["payment-types", contractType],
    queryFn: () => fetchPaymentTypes(contractType),
    enabled: enabled && !!contractType,
    staleTime: 60_000,
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
  };
}
