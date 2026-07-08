"use client";

import React, { useState } from "react";
import Header from "@/components/home/Header";
import Loader from "@/components/home/loader";
import { axiosInstance } from "@/src/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Eye, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const tableHeaders = [
  "العنوان",
  "الوصف",
  "الحالة",
  "تاريخ النشر",
  "نشط",
  "إجراءات",
];

const stripHtml = (html) => {
  if (!html) return "---";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
};

const formatDate = (dateString) => {
  if (!dateString) return "---";
  try {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const getStatusLabel = (status) => {
  if (status === "published") return "منشور";
  if (status === "draft") return "مسودة";
  return status || "---";
};

const getStatusClass = (status) => {
  if (status === "published") return "bg-[#E6FFE6] text-[#10B981]";
  if (status === "draft") return "bg-[#FFF4E6] text-[#F59E0B]";
  return "bg-[#F5F5F5] text-[#A3A3A3]";
};

export default function BlogsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: responseData, isLoading } = useQuery({
    queryKey: ["blogs", currentPage],
    queryFn: () =>
      axiosInstance
        .get(`/admin/blogs?per_page=10&page=${currentPage}`)
        .then((res) => res?.data),
  });

  const blogs = responseData?.data?.items ?? [];
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
        third="المدونة"
        thirdURL="/home/settings/blogs"
      />

      <div className="flex items-center justify-between pb-6 border-b border-[#F5F5F5] mt-4">
        <div className="flex flex-col gap-1.5 text-right">
          <h2 className="text-[22px] font-black text-black">المدونة</h2>
          <p className="text-[13px] text-gray-500 font-medium">
            إدارة مقالات المدونة وعرض حالتها وتواريخ النشر
          </p>
        </div>
        <Link href="/home/settings/blogs/create">
          <Button className="bg-brand-hover text-white h-12 rounded-full font-bold px-6 flex items-center gap-2 shadow-lg shadow-brand-main/20 hover:scale-105 active:scale-95 transition-all">
            <Plus className="size-4" />
            <span>إضافة مقال جديد</span>
          </Button>
        </Link>
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
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr
                  key={blog.id}
                  className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#fafafa] transition-all"
                >
                  <td className="p-[15px_20px]">
                    <div className="flex flex-col gap-1">
                      <span className="text-black text-[13px] font-bold">{blog.title}</span>
                      <span className="text-[#A3A3A3] text-[11px]">{blog.slug}</span>
                    </div>
                  </td>
                  <td className="p-[15px_20px] max-w-[320px]">
                    <span className="text-[#4D4D4D] text-[13px] line-clamp-2">
                      {stripHtml(blog.description)}
                    </span>
                  </td>
                  <td className="p-[15px_20px]">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${getStatusClass(blog.status)}`}
                    >
                      {getStatusLabel(blog.status)}
                    </span>
                  </td>
                  <td className="p-[15px_20px] text-[13px] text-[#A3A3A3] whitespace-nowrap">
                    {formatDate(blog.timePublish)}
                  </td>
                  <td className="p-[15px_20px]">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                        blog.isActive ? "bg-[#E6F0FF] text-[#3B82F6]" : "bg-[#F5F5F5] text-[#A3A3A3]"
                      }`}
                    >
                      {blog.isActive ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="p-[15px_20px]">
                    <div className="flex items-center gap-2">
                      <Link href={`/home/settings/blogs/${blog.id}`}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-9 rounded-full border-[#E4E4E4] hover:bg-brand-main hover:text-white hover:border-brand-main"
                          title="عرض"
                        >
                          <Eye className="size-4" />
                        </Button>
                      </Link>
                      <Link href={`/home/settings/blogs/${blog.id}/edit`}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-9 rounded-full border-[#E4E4E4] hover:bg-brand-main hover:text-white hover:border-brand-main"
                          title="تعديل"
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center p-8 text-[#A3A3A3] text-sm">
                  لا توجد مقالات في المدونة حالياً.
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
