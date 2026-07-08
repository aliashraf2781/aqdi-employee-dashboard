"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/home/Header";
import Loader from "@/components/home/loader";
import { axiosInstance } from "@/src/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

const tableHeaders = [
  "الاسم",
  "رقم الجوال",
  "المبلغ",
  "تاريخ الدفع",
  "الساعة",
  "رقم العقد",
  "طريقة الدفع",
  "العملة",
  "الحالة",
];

const periodFilters = [
  { value: "today", label: "اليوم" },
  { value: "month", label: "الشهر" },
  { value: "year", label: "السنة" },
];

const statusFilters = [
  { value: "", label: "الكل" },
  { value: "success", label: "ناجحة" },
  { value: "failed", label: "فشلت" },
];

const statusLabels = {
  success: "ناجحة",
  failed: "فشلت",
};

const getStatusClass = (status) => {
  if (status === "success") return "bg-[#E6FFE6] text-[#10B981]";
  if (status === "failed") return "bg-[#FFF0F0] text-[#E03131]";
  return "bg-[#F5F5F5] text-[#A3A3A3]";
};

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-bold text-black">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value || "all"}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all border ${
              value === option.value
                ? "bg-brand-main text-white border-brand-main shadow-md shadow-brand-main/20"
                : "bg-white text-[#616161] border-[#E4E4E4] hover:border-brand-main hover:text-brand-main"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [periodFilter, setPeriodFilter] = useState("month");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [periodFilter]);

  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ["payments", currentPage, periodFilter],
    queryFn: () => {
      const params = new URLSearchParams({
        per_page: "20",
        page: String(currentPage),
        filter: periodFilter,
      });
      return axiosInstance.get(`/admin/payments?${params.toString()}`).then((res) => res?.data);
    },
  });

  const allPayments = responseData?.data?.items ?? [];
  const payments = statusFilter
    ? allPayments.filter((payment) => payment.status === statusFilter)
    : allPayments;
  const pagination = responseData?.data?.pagination;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6" dir="rtl">
      <Header
        page="welcome"
        title="الإعـدادات"
        isMain={false}
        first="الرئيــسية"
        firstURL="/"
        second="الإعـدادات"
        secondURL="/home/settings"
        third="المدفوعات"
        thirdURL="/home/settings/payments"
      />

      <div className="flex flex-col gap-1.5 pb-6 border-b border-[#F5F5F5] mt-4">
        <h2 className="text-[22px] font-black text-black">المدفوعات</h2>
        <p className="text-[13px] text-gray-500 font-medium">
          عرض وإدارة المدفوعات
          {pagination?.total != null && (
            <span className="text-[#616161]"> — إجمالي {pagination.total} عملية</span>
          )}
        </p>
      </div>

      <div className="bg-white rounded-[20px] border border-[#E4E4E4] p-5 flex flex-col md:flex-row md:items-end gap-6 shadow-sm">
        <FilterGroup
          label="الفترة الزمنية"
          options={periodFilters}
          value={periodFilter}
          onChange={setPeriodFilter}
        />
        <FilterGroup
          label="حالة الدفع"
          options={statusFilters}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      <div className="w-full overflow-x-auto bg-white rounded-[24px] border border-[#E4E4E4] shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-[#FAFAFA]">
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className="text-right p-[15px_20px] text-[#A3A3A3] text-[13px] font-medium border-b border-[#E4E4E4] whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isError ? (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center p-8 text-[#FA5252] text-sm">
                  حدث خطأ أثناء تحميل المدفوعات.
                </td>
              </tr>
            ) : payments.length > 0 ? (
              payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#fafafa] transition-all"
                >
                  <td className="p-[15px_20px] text-[13px] font-medium text-black whitespace-nowrap">
                    {payment.name || payment.name_payment || "---"}
                  </td>
                  <td className="p-[15px_20px] text-[13px] text-[#616161] whitespace-nowrap" dir="ltr">
                    {payment.user_mobile || "---"}
                  </td>
                  <td className="p-[15px_20px] text-[13px] font-bold text-black whitespace-nowrap">
                    {payment.amount} {payment.tran_currency || ""}
                  </td>
                  <td className="p-[15px_20px] text-[13px] text-[#616161] whitespace-nowrap">
                    {payment.payment_date || "---"}
                  </td>
                  <td className="p-[15px_20px] text-[13px] text-[#616161] whitespace-nowrap">
                    {payment.payment_hour || "---"}
                  </td>
                  <td className="p-[15px_20px] text-[13px] text-black whitespace-nowrap" dir="ltr">
                    {payment.contract_uuid || "---"}
                  </td>
                  <td className="p-[15px_20px] text-[13px] text-[#616161] whitespace-nowrap">
                    {payment.payment_method || "---"}
                  </td>
                  <td className="p-[15px_20px] text-[13px] text-[#616161] whitespace-nowrap">
                    {payment.tran_currency || "---"}
                  </td>
                  <td className="p-[15px_20px]">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${getStatusClass(payment.status)}`}
                    >
                      {statusLabels[payment.status] || payment.status || "---"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center p-8 text-[#A3A3A3] text-sm">
                  لا توجد مدفوعات للفلاتر المحددة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2.5 mt-4" dir="rtl">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-full border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:bg-brand-main hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#A3A3A3]"
          >
            <ChevronRight className="size-4" />
          </button>

          {(() => {
            const pages = [];
            const { last_page } = pagination;
            const range = 1;
            const start = Math.max(1, currentPage - range);
            const end = Math.min(last_page, currentPage + range);

            if (start > 1) {
              pages.push(1);
              if (start > 2) pages.push("...");
            }

            for (let i = start; i <= end; i++) {
              pages.push(i);
            }

            if (end < last_page) {
              if (end < last_page - 1) pages.push("...");
              pages.push(last_page);
            }

            return pages.map((page, idx) => {
              if (page === "...") {
                return (
                  <span key={`dots-${idx}`} className="text-[#A3A3A3] px-1">
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-medium transition-all ${
                    currentPage === page
                      ? "bg-brand-main text-white shadow-lg shadow-brand-main/20"
                      : "border border-[#E4E4E4] text-[#A3A3A3] hover:bg-[#f5f5f5]"
                  }`}
                >
                  {page}
                </button>
              );
            });
          })()}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(pagination.last_page, prev + 1))}
            disabled={currentPage === pagination.last_page}
            className="w-9 h-9 rounded-full border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:bg-brand-main hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#A3A3A3]"
          >
            <ChevronLeft className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
