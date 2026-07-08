"use client";

import Link from "next/link";
import { ArrowUpLeft, FileSpreadsheet, Filter, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/src/utils/axios";
import AddCompleteOrder from "../add-complete-order";
import AddInCompleteOrder from "../add-incompleted-order";
import OrdersMoreFilters from "./orders-more-filters";
import { hasActiveAdvancedFilters } from "./orders-filter-utils";

const defaultQuickLinks = [
  {
    emoji: "✅",
    label: "تم التوثيق",
    href: "/home/completed-orders",
    match: ["توثيق", "وثق", "مكتمل"],
  },
  {
    emoji: "😎",
    label: "طلب واتساب مكتمل",
    href: "/home/completed-whatsapp",
    match: ["واتساب مكتمل", "واتساب المكتملة"],
  },
  {
    emoji: "😞",
    label: "مسترجع",
    href: "/home/return-orders",
    match: ["مسترج", "استرجاع"],
  },
  {
    emoji: "🤔",
    label: "طلب واتساب غير مكتمل",
    href: "/home/incompleted-whatsapp",
    match: ["واتساب غير", "غير مكتمل", "واتساب الغير"],
  },
];

function getQuickLinkCount(items, matchPatterns) {
  const item = items.find((entry) =>
    matchPatterns.some((pattern) => entry.label_ar?.includes(pattern))
  );
  return item?.value ?? 0;
}

const formatQuickCount = (count) => {
  const num = Number(count);
  if (Number.isNaN(num)) return "00";
  if (num > 99) return String(num);
  return String(num).padStart(2, "0");
};

function QuickStatCard({ emoji, label, href, count }) {
  return (
    <Link
      href={href}
      className="relative flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-[14px] border border-[#EEEEEE] hover:border-brand-main hover:shadow-sm transition-all min-w-[140px]"
    >
      <span className="text-[18px] leading-none shrink-0">{emoji}</span>
      <span className="text-[13px] font-bold text-black whitespace-nowrap">{label}</span>
      <span className="text-[15px] font-black text-black tabular-nums ms-auto">
        {formatQuickCount(count)}
      </span>
      <ArrowUpLeft className="absolute bottom-2 left-2 size-3 text-[#C4C4C4]" />
    </Link>
  );
}

export default function OrdersToolbar({
  searchQuery,
  onSearchChange,
  showAddButtons = false,
  queryKeys = [],
  showMoreFilters = false,
  onToggleMoreFilters,
  advancedFilters,
  onAdvancedFiltersChange,
  onResetAll,
  showStatusField = true,
  quickLinksLimit,
  exportConfig,
  selectedCount = 0,
  onClearSelection,
}) {
  const queryClient = useQueryClient();
  const [isExporting, setIsExporting] = useState(false);

  const { data: analyticsData } = useQuery({
    queryKey: ["dashboard-analytics-quick"],
    queryFn: () => axiosInstance.get("/admin/dashboard-analytics").then((res) => res?.data),
  });

  const analyticsItems = analyticsData?.data?.order_analytics ?? [];

  const handleRefresh = () => {
    onResetAll?.();
    queryKeys.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
    queryClient.invalidateQueries({ queryKey: ["status"] });
    queryClient.invalidateQueries({ queryKey: ["order-status-count"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-analytics-quick"] });
  };

  const filtersActive = hasActiveAdvancedFilters(advancedFilters);

  const handleExport = () => {
    if (!exportConfig?.onExport) return;

    const orders = exportConfig.getSelectedOrders?.() ?? [];
    if (!orders.length) {
      toast.error("يرجى تحديد طلب واحد على الأقل للتصدير");
      return;
    }

    setIsExporting(true);
    try {
      const exported = exportConfig.onExport(orders);

      if (exported === false) {
        toast.error("لا توجد بيانات للتصدير");
        return;
      }

      toast.success(`تم تصدير ${orders.length} طلب بنجاح`);
      onClearSelection?.();
    } catch {
      toast.error("حدث خطأ أثناء تصدير البيانات");
    } finally {
      setIsExporting(false);
    }
  };

  const quickLinks = quickLinksLimit
    ? defaultQuickLinks.slice(0, quickLinksLimit)
    : defaultQuickLinks;

  return (
    <div className="space-y-4 w-full" dir="rtl">
      {/* Single row: add buttons | quick stats | search | refresh | filter */}
      <div className="flex flex-wrap items-center gap-3 w-full">
        {showAddButtons && (
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <AddCompleteOrder />
            <AddInCompleteOrder />
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {quickLinks.map((link) => (
            <QuickStatCard
              key={link.href}
              emoji={link.emoji}
              label={link.label}
              href={link.href}
              count={getQuickLinkCount(analyticsItems, link.match)}
            />
          ))}
        </div>

        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] size-5" />
          <input
            type="text"
            placeholder="البحث الذكي...!"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-[46px] bg-[#F9F9F9] border border-[#EEEEEE] rounded-full pr-12 pl-4 text-[14px] focus:outline-none focus:border-brand-main focus:bg-white transition-all shadow-inner"
          />
        </div>

        {exportConfig ? (
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting || selectedCount === 0}
            className="h-[46px] px-5 rounded-full border border-[#10B981] bg-white text-[#10B981] hover:bg-[#10B981] hover:text-white font-bold text-[14px] transition-all shadow-sm flex items-center gap-2 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
            title={
              selectedCount > 0
                ? `تصدير ${selectedCount} طلب محدد إلى Excel`
                : "حدد الطلبات من الجدول أولاً"
            }
          >
            <FileSpreadsheet className="size-4" />
            {isExporting
              ? "جاري التصدير..."
              : selectedCount > 0
                ? `تصدير Excel (${selectedCount})`
                : "تصدير Excel"}
          </button>
        ) : null}

        {selectedCount > 0 ? (
          <button
            type="button"
            onClick={onClearSelection}
            className="h-[46px] px-4 rounded-full border border-[#EEEEEE] bg-white text-[#4D4D4D] hover:border-[#10B981] hover:text-[#10B981] font-bold text-[13px] transition-all shrink-0"
          >
            إلغاء التحديد ({selectedCount})
          </button>
        ) : null}

        <button
          type="button"
          onClick={handleRefresh}
          className="w-[46px] h-[46px] flex items-center justify-center rounded-full border border-[#EEEEEE] bg-[#10B981] text-white hover:bg-[#0E9F6E] transition-all shadow-sm shrink-0"
          title="إعادة تعيين الفلاتر"
        >
          <RefreshCw className="size-5" />
        </button>

        <button
          type="button"
          onClick={onToggleMoreFilters}
          className={`h-[46px] px-5 rounded-full border font-bold text-[14px] transition-all shadow-sm flex items-center gap-2 shrink-0 ${
            showMoreFilters || filtersActive
              ? "border-brand-main bg-brand-main text-white"
              : "border-[#212121] bg-[#212121] text-white hover:bg-black"
          }`}
        >
          <Filter className="size-4" />
          فلترة أكثر
        </button>
      </div>

      {showMoreFilters && (
        <OrdersMoreFilters
          filters={advancedFilters}
          onChange={onAdvancedFiltersChange}
          showStatusField={showStatusField}
        />
      )}
    </div>
  );
}
