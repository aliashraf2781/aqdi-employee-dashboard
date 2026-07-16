"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/src/utils/axios";
import {
  filterOrdersPageStatusItems,
  getDefaultOrdersPageStatusId,
} from "@/src/lib/orders-page-statuses";
import { useOrderStatusCounts } from "./use-order-status-counts";
import OrdersStatusCards from "./orders-status-cards";

/**
 * Shared contract-status filter tabs (جديد / استرجاع / ملغي / معلق / مستلم / تم التوثيق)
 * used across order list pages. Default selection is مستلم.
 */
export function useOrdersContractStatusFilter({
  countsBaseUrl = "/admin/orders",
  statusParam = "contract_status_id",
  countsExtraParams = "",
  enabled = true,
} = {}) {
  // null = use default (مستلم) once statuses are loaded
  const [activeFilter, setActiveFilter] = useState(null);

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["status"],
    queryFn: () => axiosInstance("/admin/contract-statuses"),
    enabled,
  });

  const statusItems = useMemo(
    () => filterOrdersPageStatusItems(statusData?.data?.data?.items),
    [statusData]
  );

  const defaultFilterId = useMemo(() => {
    const id = getDefaultOrdersPageStatusId(statusItems);
    return id != null && id !== "" ? String(id) : "";
  }, [statusItems]);

  const resolvedActiveFilter =
    activeFilter === null ? defaultFilterId : activeFilter;

  const {
    allTotal,
    byId: countsById,
    isLoading: countsLoading,
  } = useOrderStatusCounts(enabled ? statusItems : [], {
    baseUrl: countsBaseUrl,
    statusParam,
    extraParams: countsExtraParams,
  });

  const appendStatusParam = (url) => {
    if (!resolvedActiveFilter) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}${statusParam}=${resolvedActiveFilter}`;
  };

  const resetStatusFilter = () => setActiveFilter(null);

  return {
    activeFilter: resolvedActiveFilter,
    setActiveFilter,
    statusItems,
    allTotal,
    countsById,
    statusLoading: enabled ? statusLoading : false,
    countsLoading: enabled ? countsLoading : false,
    appendStatusParam,
    resetStatusFilter,
    defaultFilterId,
    /** False until contract statuses are loaded and the default (مستلم) can be resolved. */
    statusFilterReady: enabled ? !statusLoading : true,
  };
}

export function OrdersContractStatusFilterBar({
  activeFilter,
  onFilterChange,
  statusItems,
  countsById,
  allTotal,
  showAllCard = true,
  className = "flex flex-wrap gap-3",
}) {
  if (!statusItems?.length && !showAllCard) return null;

  return (
    <OrdersStatusCards
      statusItems={statusItems}
      activeFilter={activeFilter}
      onFilterChange={onFilterChange}
      showAllCard={showAllCard}
      allTotal={allTotal}
      countsById={countsById}
      gridClassName={className}
    />
  );
}
