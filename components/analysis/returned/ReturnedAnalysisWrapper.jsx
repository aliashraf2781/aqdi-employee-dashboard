"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { toast } from "sonner";
import Header from "../../home/Header";
import Loader from "../../home/loader";
import greenRial from "@/public/images/greenRial.svg";
import waIcon from "@/public/images/waIcon.svg";
import orangerial from "@/public/images/orangerial.svg";
import { axiosInstance } from "@/src/utils/axios";
import RefundContractActionsMenu from "./refund-contract-actions-menu";
import {
  canManageAdminRefund,
  getReturnAnalysisTitle,
  isAdminRefundApproved,
  mapCreatedAtFilter,
  normalizeRefundContract,
} from "./refund-contract-utils";

function AdminApprovalBadge({ confirmed }) {
  if (isAdminRefundApproved(confirmed)) {
    return (
      <span className="px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap bg-[#E6FFE6] text-[#10B981]">
        ✅ تم المــوافقة
      </span>
    );
  }
  return (
    <span className="px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap bg-[#FFF7E6] text-[#D97706]">
      ⏳ بانتظار الموافقة
    </span>
  );
}

function CustomerRefundBadge({ refunded }) {
  if (refunded === true || refunded === 1) {
    return (
      <span className="px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap bg-[#E6FFE6] text-[#10B981]">
        ✅ تم المــوافقة
      </span>
    );
  }
  if (refunded === false || refunded === 0) {
    return (
      <span className="px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap bg-[#FFE6E6] text-[#EF4444]">
        ❌ لم تتم المــوافقة
      </span>
    );
  }
  return (
    <span className="px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap bg-[#FFF7E6] text-[#D97706]">
      ⏳ بانتظار الاسترجاع
    </span>
  );
}

export default function ReturnedAnalysisWrapper({ id }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setTitle(getReturnAnalysisTitle(id));
  }, [id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [id]);

  const queryKey = ["refundContracts", id, currentPage];

  const { data: responseData, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => {
      const createdAt = mapCreatedAtFilter(id);
      return axiosInstance
        .get(`/admin/analytics/refunds/contracts?created_at=${createdAt}&page=${currentPage}`)
        .then((res) => res.data);
    },
  });

  const rawData = responseData?.data;
  const items = Array.isArray(rawData) ? rawData : (rawData?.items ?? []);
  const pagination = rawData?.pagination ?? responseData?.pagination;
  const stats = rawData?.stats ?? responseData?.stats;
  const rows = items.map(normalizeRefundContract).filter(Boolean);

  const tableHeaders = [
    "رقــم الطلب",
    "رقــم جوال العميل",
    "نــوع العقــد",
    "الدفـــع",
    "المبــلغ المطالــب اســترجاعه",
    "تم الاستــرجــاع",
    "رافــع الطلب",
    "مــوافقة الادارة",
    "عرض العقــد",
  ];

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="text-center p-8 text-[#FA5252] text-[15px]" dir="rtl">
        حدث خطأ أثناء تحميل بيانات طلبات الاسترجاع
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen" dir="rtl">
      <Header
        page="welcome"
        title={title}
        isMain={false}
        first="الرئيــسية"
        firstURL="/"
        second="التحليــلات"
        secondURL="/home/analysis"
        third={title}
        thirdURL={`/home/return-analysis/${id}`}
      />

      {(stats?.pending != null || stats?.completed != null) && (
        <div className="flex flex-wrap items-center gap-3">
          {stats?.pending != null && (
            <span className="px-4 py-2 rounded bg-[#FFF7E6] text-[#D97706] text-[13px] font-bold">
              بانتظار الاسترجاع: {stats.pending}
            </span>
          )}
          {stats?.completed != null && (
            <span className="px-4 py-2 rounded bg-[#E6FFE6] text-[#10B981] text-[13px] font-bold">
              تم الاسترجاع: {stats.completed}
            </span>
          )}
        </div>
      )}

      <div className="w-full overflow-x-auto bg-white rounded-[24px] border border-[#E4E4E4] mt-4 shadow-sm">
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
            {rows.length > 0 ? (
              rows.map((row) => {
                const isHousing =
                  row.contractTypeKey === "housing" ||
                  row.contractType === "سكنـي" ||
                  row.contractType === "سكني";

                return (
                  <tr
                    key={row.id}
                    className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#fafafa] transition-all"
                  >
                    <td className="p-[15px_20px]">
                      <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-[#f9f9f9]  w-fit mx-auto border border-[#eee]">
                        <span className="text-black text-[12px] font-bold">{row.orderUuid}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(String(row.orderUuid));
                            toast.success("تم نسخ رقم الطلب");
                          }}
                          className="text-[#A3A3A3] hover:text-brand-main"
                        >
                          <i className="fa-regular fa-copy text-[11px]" />
                        </button>
                      </div>
                    </td>
                    <td className="p-[15px_20px]">
                      <div className="flex items-center gap-2">
                        <span className="text-black text-[13px]" dir="ltr">
                          {row.userMobile || "—"}
                        </span>
                        {row.userMobile ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(row.userMobile);
                                toast.success("تم نسخ رقم الجوال");
                              }}
                              className="text-[#A3A3A3] hover:text-brand-main"
                            >
                              <i className="fa-regular fa-copy text-[11px]" />
                            </button>
                            <Link
                              href={`https://wa.me/${row.userMobile}`}
                              target="_blank"
                              className="hover:scale-110 transition-all"
                            >
                              <Image src={waIcon} alt="wa" width={16} height={16} />
                            </Link>
                          </>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-[15px_20px]">
                      <span
                        className={`px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap ${
                          isHousing
                            ? "bg-[#F0E6FF] text-[#7C3AED]"
                            : "bg-[#FFE6F0] text-[#EC4899]"
                        }`}
                      >
                        {row.contractType}
                      </span>
                    </td>
                    <td className="p-[15px_20px]">
                      {row.isPaid ? (
                        <div className="flex items-center gap-1.5 text-[#007C13] font-bold text-[13px]">
                          <span>{row.amountPayment ?? "—"}</span>
                          <Image src={greenRial} alt="rial" width={14} height={14} />
                          <i className="fa-solid fa-circle-check text-[12px]" />
                        </div>
                      ) : (
                        <span className="text-[13px] font-bold text-[#EF4444]">
                          {row.paymentLabelAr || "لم يتم الدفع"}
                        </span>
                      )}
                    </td>
                    <td className="p-[15px_20px]">
                      <div className="flex items-center gap-1.5 text-brand-main font-bold text-[13px]">
                        <span>{row.refundAmount ?? "—"}</span>
                        <Image src={orangerial} alt="rial" width={14} height={14} />
                      </div>
                    </td>
                    <td className="p-[15px_20px]">
                      <CustomerRefundBadge refunded={row.customerRefunded} />
                    </td>
                    <td className="p-[15px_20px]">
                      <span className="px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap bg-[#F0E6FF] text-[#7C3AED]">
                        {row.employeeName}
                      </span>
                    </td>
                    <td className="p-[15px_20px]">
                      <AdminApprovalBadge confirmed={row.adminConfirmed} />
                    </td>
                    <td className="p-[15px_20px]">
                      <div className="flex items-center gap-2">
                        {canManageAdminRefund(row) ? (
                          <RefundContractActionsMenu refund={row} queryKey={queryKey} />
                        ) : null}
                        <button
                          type="button"
                          onClick={() => {
                            if (row.contractId) {
                              router.push(`/home/orders/${row.contractId}`);
                            } else {
                              toast.error("تعذر فتح العقد");
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F5F5F5] text-[#4D4D4D] hover:bg-brand-main hover:text-white transition-all"
                          aria-label="عرض العقد"
                        >
                          <Eye className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="text-center p-8 text-[#A3A3A3] text-sm"
                >
                  لا توجد طلبات استرجاع متوفرة حالياً
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2.5 mt-4" dir="rtl">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="w-9 h-9 rounded-full border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:bg-brand-main hover:text-white transition-all disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === pagination.last_page ||
                Math.abs(page - currentPage) <= 1
            )
            .map((page, index, arr) => {
              const prev = arr[index - 1];
              const showEllipsis = prev && page - prev > 1;
              return (
                <React.Fragment key={page}>
                  {showEllipsis ? (
                    <span className="text-[#A3A3A3] px-1">...</span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-medium transition-all ${
                      currentPage === page
                        ? "bg-brand-main text-white shadow-lg shadow-brand-main/20"
                        : "border border-[#E4E4E4] text-[#A3A3A3] hover:bg-[#f5f5f5]"
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(pagination.last_page, p + 1))}
            disabled={currentPage >= pagination.last_page}
            className="w-9 h-9 rounded-full border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:bg-brand-main hover:text-white transition-all disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
