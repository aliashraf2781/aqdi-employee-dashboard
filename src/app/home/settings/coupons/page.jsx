"use client";

import React, { useState } from "react";
import Header from "@/components/home/Header";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/src/utils/axios";
import Loader from "@/components/home/loader";
import CouponCard from "@/components/analysis/settings/coupons/coupon-card";
import AddCouponDialog from "@/components/analysis/settings/coupons/add-coupon-dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CouponsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Coupons from Server
  const { data: serverCouponsData, isLoading } = useQuery({
    queryKey: ["coupons", currentPage],
    queryFn: () => axiosInstance.get(`/admin/coupons?page=${currentPage}`).then((res) => res?.data),
  });

  const displayCoupons = serverCouponsData?.data?.items || serverCouponsData?.items || [];
  const pagination = serverCouponsData?.data?.pagination || serverCouponsData?.pagination;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6" dir="rtl">
      {/* App Header */}
      <Header 
        page="welcome" 
        title="الإعـدادات" 
        isMain={false} 
        first="الرئيــسية" 
        firstURL="/" 
        second="الإعـدادات" 
        secondURL="/home/settings" 
        third="الخصومات" 
        thirdURL="/home/settings/coupons" 
      />

      {/* Page Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#F5F5F5] mt-4">
        <div className="flex flex-col gap-1.5 text-right">
          <h2 className="text-[22px] font-black text-black">الخصومات (الكوبونات)</h2>
          <p className="text-[13px] text-gray-500 font-medium">إدارة كوبونات خصومات النظام وربط حدود استخدامها للمستخدمين</p>
        </div>
        
        <AddCouponDialog />
      </div>

      {/* Cards Grid */}
      {displayCoupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {displayCoupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-[#F0F0F0] p-12 text-center text-gray-400 font-bold text-sm shadow-sm mt-4">
          لا يوجد كوبونات خصم مسجلة حالياً. اضغط على &quot;إضافة خصم جديد&quot; للبدء.
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2.5 mt-8" dir="rtl">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-full border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:bg-brand-main hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent"
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
              if (start > 2) pages.push('...');
            }

            for (let i = start; i <= end; i++) {
              pages.push(i);
            }

            if (end < last_page) {
              if (end < last_page - 1) pages.push('...');
              pages.push(last_page);
            }

            return pages.map((page, idx) => {
              if (page === '...') {
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
            className="w-9 h-9 rounded-full border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:bg-brand-main hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}