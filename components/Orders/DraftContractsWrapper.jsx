"use client";

import React, { useEffect, useMemo, useState } from "react";
import Header from "../home/Header";
import { axiosInstance } from "@/src/utils/axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../home/loader";
import { useRouter } from "next/navigation";
import OrdersToolbar from "./shared/orders-toolbar";
import OrdersStatusCards from "./shared/orders-status-cards";
import OrdersTable from "./shared/orders-table";
import OrdersPagination from "./shared/orders-pagination";
import {
  applyAdvancedFilters,
  emptyAdvancedFilters,
} from "./shared/orders-filter-utils";
import { exportOrdersToExcel } from "./shared/orders-export";
import { useOrdersSelection } from "./shared/use-orders-selection";
import { useOrderStatusCounts } from "./shared/use-order-status-counts";

const DRAFT_CONTRACTS_QUERY_KEY = "draftContracts";
const DRAFT_CONTRACTS_API = "/admin/contracts/draft";

export default function DraftContractsWrapper() {
  const [activeFilter, setActiveFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(emptyAdvancedFilters);
  const router = useRouter();
  const {
    selectedOrders,
    selectedCount,
    isSelected,
    toggle,
    togglePage,
    clear,
    getPageSelectionState,
  } = useOrdersSelection();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, debouncedSearchQuery]);

  useEffect(() => {
    clear();
  }, [activeFilter, debouncedSearchQuery, advancedFilters, clear]);

  const handleResetAll = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setActiveFilter("");
    setAdvancedFilters(emptyAdvancedFilters);
    setShowMoreFilters(false);
    setCurrentPage(1);
    clear();
  };

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["status"],
    queryFn: () => axiosInstance("/admin/contract-statuses"),
  });

  const statusItems = statusData?.data?.data?.items;

  const { allTotal, byId: countsById } = useOrderStatusCounts(statusItems, {
    baseUrl: DRAFT_CONTRACTS_API,
    statusParam: "contract_status_id",
  });

  const { data, isLoading } = useQuery({
    queryKey: [DRAFT_CONTRACTS_QUERY_KEY, activeFilter, debouncedSearchQuery, currentPage],
    queryFn: () => {
      let url = `${DRAFT_CONTRACTS_API}?contract_status_id=${activeFilter}&page=${currentPage}`;
      if (debouncedSearchQuery) {
        url += `&search=${encodeURIComponent(debouncedSearchQuery)}`;
      }
      return axiosInstance(url);
    },
  });

  const orders = data?.data?.data?.items ?? [];
  const pagination = data?.data?.data?.pagination;

  const filteredOrders = useMemo(
    () => applyAdvancedFilters(orders, advancedFilters, { showStatusColumn: true }),
    [orders, advancedFilters]
  );

  const exportConfig = useMemo(
    () => ({
      getSelectedOrders: () => selectedOrders,
      onExport: (rows) =>
        exportOrdersToExcel(rows, { filename: "مسودة-العقود", showStatusColumn: true }),
    }),
    [selectedOrders]
  );

  const pageSelectionState = getPageSelectionState(filteredOrders);

  if (isLoading || statusLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen" dir="rtl">
      <Header
        page="welcome"
        title="مسودة العقود"
        isMain={false}
        first="الرئيــسية"
        firstURL="/"
        second="مسودة العقود"
        secondURL="/home/draft-contracts"
      />

      <div className="flex flex-col gap-6 mt-4 relative z-10">
        <OrdersToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showAddButtons
          queryKeys={[DRAFT_CONTRACTS_QUERY_KEY]}
          showMoreFilters={showMoreFilters}
          onToggleMoreFilters={() => setShowMoreFilters((prev) => !prev)}
          advancedFilters={advancedFilters}
          onAdvancedFiltersChange={setAdvancedFilters}
          onResetAll={handleResetAll}
          showStatusField
          exportConfig={exportConfig}
          selectedCount={selectedCount}
          onClearSelection={clear}
        />
        <OrdersStatusCards
          statusItems={statusItems}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          showAllCard={false}
          allTotal={allTotal}
          countsById={countsById}
        />
      </div>

      <OrdersTable
        orders={filteredOrders}
        showStatusColumn
        showChangeStatus
        queryKey={[DRAFT_CONTRACTS_QUERY_KEY]}
        onRowClick={(row) => router.push(`/home/orders/${row.id}`)}
        selectable
        isSelected={isSelected}
        onToggleRow={toggle}
        onTogglePage={togglePage}
        pageSelectionState={pageSelectionState}
      />

      <OrdersPagination
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
