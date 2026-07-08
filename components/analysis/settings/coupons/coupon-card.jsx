"use client";

import React from "react";
import { Calendar, Percent, Ticket, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/src/utils/axios";
import { toast } from "sonner";
import AddCouponDialog from "./add-coupon-dialog";
import DeleteCouponDialog from "./delete-coupon-dialog";
import Image from "next/image";

export default function CouponCard({ coupon }) {
  const queryClient = useQueryClient();

  // Extract variables safely mapping either API or local schema keys
  const name = coupon.name;
  const code = coupon.code_coupon || coupon.code || "---";
  const type = coupon.type_coupon || coupon.type || "value";
  const value = coupon.value_coupon || coupon.value || 0;
  const startDate = coupon.date_start || coupon.start_date || "";
  const endDate = coupon.date_end || coupon.end_date || "";
  const usageLimit = coupon.usage || coupon.use_limit || 0;
  const limitPerUser = coupon.usage_of_user || coupon.user_use_limit || 1;
  const isActive = typeof coupon.is_active === "boolean"
    ? coupon.is_active
    : coupon.is_active === 1 || coupon.is_active === "1";

  const { mutate: toggleStatus, isPending: isToggling } = useMutation({
    mutationFn: (checked) => {
      const actionPath = checked ? "activate" : "inactive";
      return axiosInstance.post(`/admin/coupons/${coupon.id}/${actionPath}`);
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message || "تم تحديث حالة الخصم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تغيير حالة الخصم");
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const isPercentage = type === "ratio" || type === "percentage" || type === "النسبة المئوية";

  return (
    <div
      className="bg-white rounded-[32px] border border-[#E4E4E4] p-6 hover:shadow-lg transition-all duration-300 relative group flex flex-col justify-between min-h-[380px] shadow-sm"
      dir="rtl"
    >
      {/* Top Section */}
      <div className="flex items-center justify-between w-full">
        {/* Left Shield Icon */}
        <Image
          src="/images/logo.svg"
          width={20}
          height={20}
          alt="coupon"
        />

        {/* Center Circular Badge */}
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
          {isPercentage ? <Percent className="size-4" /> : <Ticket className="size-4" />}
        </div>

        {/* Right Toggle Active State */}
        <div className="flex items-center gap-2">

          <Switch
            disabled={isToggling}
            dir="ltr"
            checked={isActive}
            onCheckedChange={(checked) => toggleStatus(checked)}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>
      </div>

      {/* Centered Main Info */}
      <div className="flex flex-col items-center justify-center text-center mt-4">
        <h3 className="font-extrabold text-[20px] text-black transition-colors line-clamp-1">
          {name}
        </h3>

        <span className="text-[13px] font-bold text-[#80868b] mt-1 tracking-wide uppercase">
          {code}
        </span>

        {/* Date format matched to screenshot */}
        <div className="text-[13px] font-bold text-[#80868b] mt-5 flex items-center justify-center gap-2">
          <span>{formatDate(endDate)}</span>
          <span className="text-gray-300 font-normal">•</span>
          <span>{formatDate(startDate)}</span>
        </div>
      </div>

      {/* Stats Divider Row */}
      <div className="grid grid-cols-2 mt-6 border-t border-[#f1f3f4] pt-4 text-center w-full">
        <div className="flex flex-col gap-1 pr-2 border-l border-[#f1f3f4]">
          <span className="text-[20px] font-black text-blue-600 whitespace-nowrap">
            {isPercentage ? `${parseFloat(value).toLocaleString('ar-EG')} %` : `${parseFloat(value).toLocaleString('ar-EG')} ريال`}
          </span>
          <span className="text-[12px] text-[#80868b] font-bold">قيمة الخصم</span>
        </div>

        <div className="flex flex-col gap-1 pr-2">
          <span className="text-[20px] font-black text-blue-600">
            {parseInt(usageLimit).toLocaleString('ar-EG')}
          </span>
          <span className="text-[12px] text-[#80868b] font-bold">عدد مرات استخدام الخصم</span>
        </div>
      </div>

      {/* Usage Limit per user */}
      <div className="flex flex-col items-center justify-center text-center mt-5">
        <span className="text-[22px] font-black text-blue-600">
          {limitPerUser.toLocaleString('ar-EG')}
        </span>
        <span className="text-[12px] text-[#80868b] font-bold mt-1">
          عدد مرات استخدام الخصم لكل مستخدم
        </span>
      </div>

      {/* Bottom Actions matching pill design */}
      <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-[#f1f3f4]">
        <AddCouponDialog isEdit={true} coupon={coupon} />
        <DeleteCouponDialog coupon={coupon} />
      </div>
    </div>
  );
}
