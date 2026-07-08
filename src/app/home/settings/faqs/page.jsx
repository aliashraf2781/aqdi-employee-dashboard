"use client";

import { useState } from "react";
import Header from "@/components/home/Header";
import Loader from "@/components/home/loader";
import { axiosInstance } from "@/src/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddFaqDialog from "@/components/analysis/settings/faqs/add-faq-dialog";
import EditFaqDialog from "@/components/analysis/settings/faqs/edit-faq-dialog";
import DeleteFaqDialog from "@/components/analysis/settings/faqs/delete-faq-dialog";

const PER_PAGE = 10;

const tableHeaders = ["السؤال", "الجواب", "الإجراءات"];

export default function FaqsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: responseData, isLoading } = useQuery({
    queryKey: ["faqs", currentPage],
    queryFn: () =>
      axiosInstance
        .get(`/admin/faqs?per_page=${PER_PAGE}&page=${currentPage}`)
        .then((res) => res?.data),
  });

  const faqs = responseData?.data?.items ?? [];
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
        third="الأسئلة الشائعة"
        thirdURL="/home/settings/faqs"
      />

      <div className="flex items-center justify-between pb-6 border-b border-[#F5F5F5] mt-4">
        <div className="flex flex-col gap-1.5 text-right">
          <h2 className="text-[22px] font-black text-black">الأسئلة الشائعة</h2>
          <p className="text-[13px] text-gray-500 font-medium">
            إدارة الأسئلة الشائعة وإجاباتها للعملاء
            {pagination?.total != null && (
              <span className="mr-2 text-brand-main">({pagination.total} سؤال)</span>
            )}
          </p>
        </div>
        <AddFaqDialog />
      </div>

      <div className="w-full overflow-x-auto bg-white rounded-[24px] border border-[#E4E4E4] shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-[#FAFAFA]">
            <tr>
              {tableHeaders.map((header) => (
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
            {faqs.length > 0 ? (
              faqs.map((faq) => (
                <tr
                  key={faq.id}
                  className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#fafafa] transition-all"
                >
                  <td className="p-[15px_20px] align-top min-w-[200px]">
                    <span className="text-black text-[13px] font-bold leading-relaxed">
                      {faq.title_ar || faq.title_trans || "---"}
                    </span>
                  </td>
                  <td className="p-[15px_20px] align-top max-w-[480px]">
                    <p className="text-[#4D4D4D] text-[13px] leading-relaxed line-clamp-4 whitespace-pre-wrap">
                      {faq.answer_ar || faq.answer_trans || "---"}
                    </p>
                  </td>
                  <td className="p-[15px_20px] align-top">
                    <div className="flex items-center gap-2">
                      <EditFaqDialog faq={faq} />
                      <DeleteFaqDialog faq={faq} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center p-8 text-[#A3A3A3] text-sm">
                  لا توجد أسئلة شائعة حالياً. اضغط على &quot;إضافة سؤال جديد&quot; للبدء.
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
              );
            });
          })()}

          <button
            type="button"
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
