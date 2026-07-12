"use client";

import { useState } from "react";
import Loader from "@/components/home/loader";
import OrdersPagination from "@/components/Orders/shared/orders-pagination";
import { axiosInstance } from "@/src/utils/axios";
import { useQuery } from "@tanstack/react-query";
import {
  extractUsedPopupInstrumentTypes,
  formatPopupStatus,
  getPopupInstrumentTypeLabel,
  POPUP_CONTRACTS_API,
  POPUP_CONTRACTS_QUERY_KEY,
  stripHtmlContent,
} from "@/src/lib/popup-contracts";
import AddPopupContractDialog from "./add-popup-contract-dialog";
import EditPopupContractDialog from "./edit-popup-contract-dialog";
import DeletePopupContractDialog from "./delete-popup-contract-dialog";

const PER_PAGE = 10;

const tableHeaders = [
  "نوع الوثيقة",
  "حالة بوب أب العقد",
  "حالة بوب أب العقار",
  "محتوى البوب أب",
  "نص الزر الإضافي",
  "رابط الزر الإضافي",
  "الإجراءات",
];

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        active ? "bg-[#E6FFE6] text-[#10B981]" : "bg-[#F5F5F5] text-[#737373]"
      }`}
    >
      {formatPopupStatus(active)}
    </span>
  );
}

export default function PopupContractsTab() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: usedTypesResponse } = useQuery({
    queryKey: [POPUP_CONTRACTS_QUERY_KEY, "used-types"],
    queryFn: () =>
      axiosInstance
        .get(`${POPUP_CONTRACTS_API}?per_page=100&page=1`)
        .then((res) => res?.data),
  });

  const { data: responseData, isLoading } = useQuery({
    queryKey: [POPUP_CONTRACTS_QUERY_KEY, currentPage],
    queryFn: () =>
      axiosInstance
        .get(`${POPUP_CONTRACTS_API}?per_page=${PER_PAGE}&page=${currentPage}`)
        .then((res) => res?.data),
  });

  const items = responseData?.data?.items ?? [];
  const pagination = responseData?.data?.pagination;
  const usedInstrumentTypes = extractUsedPopupInstrumentTypes(
    usedTypesResponse?.data?.items ?? []
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#F5F5F5] pb-6">
        <div className="flex flex-col gap-1.5 text-right">
          <h2 className="text-[22px] font-black text-black">محتوى إرشادي للعقود</h2>
          <p className="text-[13px] font-medium text-gray-500">
            إدارة محتوى البوب أب حسب نوع الوثيقة
            {pagination?.total != null && (
              <span className="mr-2 text-brand-main">({pagination.total} عنصر)</span>
            )}
          </p>
        </div>
        <AddPopupContractDialog usedInstrumentTypes={usedInstrumentTypes} />
      </div>

      <div className="w-full overflow-x-auto rounded-[24px] border border-[#E4E4E4] bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-[#FAFAFA]">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header}
                  className="whitespace-nowrap border-b border-[#E4E4E4] p-[15px_20px] text-right text-[13px] font-medium text-[#A3A3A3]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#F5F5F5] transition-all last:border-0 hover:bg-[#fafafa]"
                >
                  <td className="whitespace-nowrap p-[15px_20px] align-top">
                    <span className="text-[13px] font-bold text-black">
                      {getPopupInstrumentTypeLabel(item.instrument_type)}
                    </span>
                  </td>
                  <td className="p-[15px_20px] align-top">
                    <StatusBadge active={item.popup_status_contract} />
                  </td>
                  <td className="p-[15px_20px] align-top">
                    <StatusBadge active={item.popup_status_realestate} />
                  </td>
                  <td className="max-w-[280px] p-[15px_20px] align-top">
                    <p className="line-clamp-3 text-[13px] leading-relaxed text-[#4D4D4D]">
                      {stripHtmlContent(item.content_popup) || "---"}
                    </p>
                  </td>
                  <td className="whitespace-nowrap p-[15px_20px] align-top">
                    <span className="text-[13px] font-medium text-black">
                      {item.button_text || "---"}
                    </span>
                  </td>
                  <td className="max-w-[220px] p-[15px_20px] align-top">
                    {item.button_link ? (
                      <a
                        href={item.button_link}
                        target="_blank"
                        rel="noreferrer"
                        className="line-clamp-2 break-all text-[13px] font-medium text-brand-main hover:underline"
                      >
                        {item.button_link}
                      </a>
                    ) : (
                      <span className="text-[13px] text-[#A3A3A3]">---</span>
                    )}
                  </td>
                  <td className="p-[15px_20px] align-top">
                    <div className="flex items-center gap-2">
                      <EditPopupContractDialog
                        item={item}
                        usedInstrumentTypes={usedInstrumentTypes}
                      />
                      {/* <DeletePopupContractDialog item={item} /> */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="p-8 text-center text-sm text-[#A3A3A3]"
                >
                  لا يوجد محتوى إرشادي حالياً. اضغط على &quot;إضافة محتوى جديد&quot; للبدء.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <OrdersPagination
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
