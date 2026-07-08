"use client";

import CreateContractPaidDialog from "@/components/Orders/contract-paid/create-contract-paid-dialog";
import {
  CONTRACT_PAID_API,
  CONTRACT_PAID_QUERY_KEY,
  extractPaymentFromResponse,
  normalizeContractPaidList,
} from "@/components/Orders/contract-paid/contract-paid-utils";
import PaymentLinkDialog from "@/components/Orders/shared/payment-link-dialog";
import Header from "@/components/home/Header";
import Loader from "@/components/home/loader";
import OrdersPagination from "@/components/Orders/shared/orders-pagination";
import greenRial from "@/public/images/greenRial.svg";
import waIcon from "@/public/images/waIcon.svg";
import { axiosInstance } from "@/src/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { Link2, Loader2, RefreshCw, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PAYMENT_FILTERS = [
  { value: "", label: "الكل" },
  { value: "1", label: "مدفوع" },
  { value: "0", label: "غير مدفوع" },
];

function PaymentStatusBadge({ isPaid }) {
  const paid = isPaid === true || isPaid === 1;

  if (paid) {
    return (
      <span className="px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap bg-[#E6FFE6] text-[#10B981]">
        تم الدفع
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap bg-[#FFF4E6] text-[#F59E0B]">
      لم يتم الدفع
    </span>
  );
}

export default function ContractPaidWrapper() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [paidFilter, setPaidFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentLink, setPaymentLink] = useState({ paymentUrl: "", cartAmount: null });
  const [loadingPaymentId, setLoadingPaymentId] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, paidFilter]);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: [CONTRACT_PAID_QUERY_KEY, currentPage, debouncedSearchQuery, paidFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(currentPage) });

      if (debouncedSearchQuery) {
        params.set("search", debouncedSearchQuery);
      }

      if (paidFilter !== "") {
        params.set("is_paid", paidFilter);
      }

      const res = await axiosInstance.get(`${CONTRACT_PAID_API}?${params.toString()}`);
      return normalizeContractPaidList(res);
    },
  });

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  const handleRefresh = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setPaidFilter("");
    setCurrentPage(1);
    refetch();
  };

  const handleOpenPaymentLink = async (record) => {
    setLoadingPaymentId(record.id);
    try {
      const res = await axiosInstance.get(`${CONTRACT_PAID_API}/${record.id}`);
      const { paymentUrl, cartAmount } = extractPaymentFromResponse(res.data);

      if (!paymentUrl) {
        toast.error("رابط الدفع غير متوفر لهذا السجل");
        return;
      }

      setPaymentLink({ paymentUrl, cartAmount: cartAmount ?? record.amount });
      setPaymentDialogOpen(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "تعذر جلب رابط الدفع");
    } finally {
      setLoadingPaymentId(null);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen" dir="rtl">
      <Header
        page="welcome"
        title="إنشاء عقد مدفوع"
        isMain={false}
        first="الرئيــسية"
        firstURL="/"
        second="إنشاء عقد مدفوع"
        secondURL="/home/contract-paid"
      />

      <div className="flex flex-wrap items-center gap-3 w-full">
        <CreateContractPaidDialog />

        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] size-5" />
          <input
            type="text"
            placeholder="البحث برقم الجوال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[46px] bg-[#F9F9F9] border border-[#EEEEEE] rounded-full pr-12 pl-4 text-[14px] focus:outline-none focus:border-brand-main focus:bg-white transition-all shadow-inner"
          />
        </div>

        <select
          value={paidFilter}
          onChange={(e) => setPaidFilter(e.target.value)}
          className="h-[46px] min-w-[140px] rounded-full border border-[#EEEEEE] bg-white px-4 text-[14px] font-medium text-[#4D4D4D] focus:outline-none focus:border-brand-main"
        >
          {PAYMENT_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isFetching}
          className="w-[46px] h-[46px] flex items-center justify-center rounded-full border border-[#EEEEEE] bg-[#10B981] text-white hover:bg-[#0E9F6E] transition-all shadow-sm shrink-0 disabled:opacity-60"
          title="تحديث"
        >
          <RefreshCw className={`size-5 ${isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="w-full overflow-x-auto bg-white rounded-[24px] border border-[#E4E4E4] shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-[#FAFAFA]">
            <tr>
              {[
                "رقــم العقد",
                "رقــم جوال العميل",
                "المبلغ",
                "الموظف",
                "حالة الدفع",
                "تاريخ الإنشاء",
                "الاجـــراءات",
              ].map((header) => (
                <th
                  key={header}
                  className="text-right p-[15px_20px] text-[#A3A3A3] text-[13px] font-medium border-b border-[#E4E4E4] whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-[#A3A3A3] text-sm">
                  لا توجد سجلات حالياً
                </td>
              </tr>
            ) : (
              items.map((row) => {
                const isPaid = row.is_paid === true || row.is_paid === 1;

                return (
                  <tr
                    key={row.id}
                    className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#fafafa] transition-all"
                  >
                    <td className="p-[15px_20px]">
                      <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-[#f9f9f9] rounded-lg w-fit mx-auto border border-[#eee]">
                        <span className="text-black text-[12px] font-bold">
                          {row.contract_uuid || "---"}
                        </span>
                        {row.contract_uuid ? (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(row.contract_uuid);
                              toast.success("تم نسخ رقم العقد");
                            }}
                            className="text-[#A3A3A3] hover:text-brand-main"
                          >
                            <i className="fa-regular fa-copy text-[11px]" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-[15px_20px]">
                      <div className="flex items-center gap-2">
                        {row.customer_mobile ? (
                          <Link
                            href={`https://wa.me/${row.customer_mobile}`}
                            target="_blank"
                            className="hover:scale-110 transition-all"
                          >
                            <Image src={waIcon} alt="wa" width={16} height={16} />
                          </Link>
                        ) : null}
                        <span className="text-black text-[13px]" dir="ltr">
                          {row.customer_mobile || "---"}
                        </span>
                        {row.customer_mobile ? (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(row.customer_mobile);
                              toast.success("تم نسخ رقم الجوال");
                            }}
                            className="text-[#A3A3A3] hover:text-brand-main"
                          >
                            <i className="fa-regular fa-copy text-[11px]" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-[15px_20px]">
                      <div className="flex items-center gap-1.5 text-[#007C13] font-bold text-[13px]">
                        <span>{row.amount ?? "---"}</span>
                        <Image src={greenRial} alt="rial" width={14} height={14} />
                      </div>
                    </td>
                    <td className="p-[15px_20px]">
                      <span className="text-[13px] text-[#4D4D4D] font-medium">
                        {row.employee_name || "---"}
                      </span>
                    </td>
                    <td className="p-[15px_20px]">
                      <PaymentStatusBadge isPaid={row.is_paid} />
                    </td>
                    <td className="p-[15px_20px] text-[13px] text-black font-medium whitespace-nowrap">
                      {row.created_at || "---"}
                    </td>
                    <td className="p-[15px_20px]">
                      {!isPaid ? (
                        <button
                          type="button"
                          onClick={() => handleOpenPaymentLink(row)}
                          disabled={loadingPaymentId === row.id}
                          className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-[#0019FF] text-white text-[12px] font-bold hover:bg-[#0015CC] transition-all disabled:opacity-60"
                        >
                          {loadingPaymentId === row.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Link2 className="size-4" />
                          )}
                          رابط الدفع
                        </button>
                      ) : (
                        <span className="text-[12px] text-[#A3A3A3]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <OrdersPagination
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <PaymentLinkDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        paymentUrl={paymentLink.paymentUrl}
        cartAmount={paymentLink.cartAmount}
      />
    </div>
  );
}
