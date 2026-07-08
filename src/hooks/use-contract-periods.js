"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/src/utils/axios";
import {
  groupContractPeriodsByContractType,
  normalizeContractPeriods,
} from "@/src/lib/contract-period-utils";

const CONTRACT_TYPES = ["housing", "commercial"];

async function fetchContractPeriods(contractType) {
  const res = await axiosInstance.get("/admin/contract-periods", {
    params: { contract_type: contractType },
  });

  return normalizeContractPeriods(res.data).map((period) => ({
    ...period,
    contract_type: period?.contract_type || contractType,
  }));
}

async function fetchAllContractPeriods() {
  const results = await Promise.all(CONTRACT_TYPES.map(fetchContractPeriods));
  return results.flat();
}

export function useContractPeriods(enabled = true) {
  const query = useQuery({
    queryKey: ["contract-periods", "all", "order-nav"],
    queryFn: fetchAllContractPeriods,
    enabled,
    staleTime: 60_000,
  });

  const groups = groupContractPeriodsByContractType(query.data ?? []);
  const hasPeriods = groups.some((group) =>
    group.sections.some((section) => section.items.length > 0)
  );

  return {
    groups,
    isLoading: query.isLoading,
    hasPeriods,
  };
}
