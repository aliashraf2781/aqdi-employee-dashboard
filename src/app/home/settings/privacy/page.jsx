"use client";

import Header from "@/components/home/Header";
import Loader from "@/components/home/loader";
import ContentPageForm from "@/components/analysis/settings/terms/content-page-form";
import { axiosInstance } from "@/src/utils/axios";
import { useQuery } from "@tanstack/react-query";

export default function PrivacyPage() {
  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ["privacy-policy"],
    queryFn: () =>
      axiosInstance.get("/admin/content/privacy").then((res) => res?.data),
  });

  const privacy = responseData?.data;

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
        third="سياسة الخصوصية"
        thirdURL="/home/settings/privacy"
      />

      <div className="flex flex-col gap-1.5 pb-6 border-b border-[#F5F5F5] mt-4">
        <h2 className="text-[22px] font-black text-black">سياسة الخصوصية</h2>
        <p className="text-[13px] text-gray-500 font-medium">
          تحرير وتحديث محتوى سياسة الخصوصية
        </p>
      </div>

      {isError ? (
        <p className="text-center text-[#A3A3A3] py-10">تعذر تحميل المحتوى.</p>
      ) : (
        <div className="bg-white rounded-[24px] border border-[#E4E4E4] p-6 shadow-sm">
          <ContentPageForm
            content={privacy}
            saveEndpoint="/admin/content/privacy"
            queryKey="privacy-policy"
          />
        </div>
      )}
    </div>
  );
}
