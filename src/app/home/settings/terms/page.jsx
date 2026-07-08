"use client";

import Header from "@/components/home/Header";
import Loader from "@/components/home/loader";
import ContentPageForm from "@/components/analysis/settings/terms/content-page-form";
import { axiosInstance } from "@/src/utils/axios";
import { useQuery } from "@tanstack/react-query";

export default function TermsPage() {
  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ["terms-and-conditions"],
    queryFn: () =>
      axiosInstance.get("/admin/content/terms-and-conditions").then((res) => res?.data),
  });

  const terms = responseData?.data;

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
        third="الشروط والاحكام"
        thirdURL="/home/settings/terms"
      />

      <div className="flex flex-col gap-1.5 pb-6 border-b border-[#F5F5F5] mt-4">
        <h2 className="text-[22px] font-black text-black">الشروط والاحكام</h2>
        <p className="text-[13px] text-gray-500 font-medium">
          تحرير وتحديث محتوى الشروط والاحكام
        </p>
      </div>

      {isError ? (
        <p className="text-center text-[#A3A3A3] py-10">تعذر تحميل المحتوى.</p>
      ) : (
        <div className="bg-white rounded-[24px] border border-[#E4E4E4] p-6 shadow-sm">
          <ContentPageForm
            content={terms}
            saveEndpoint="/admin/content/terms-and-conditions"
            queryKey="terms-and-conditions"
          />
        </div>
      )}
    </div>
  );
}
