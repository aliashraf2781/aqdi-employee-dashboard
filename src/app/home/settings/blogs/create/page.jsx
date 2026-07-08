"use client";

import Header from "@/components/home/Header";
import CreateBlogForm from "@/components/analysis/settings/blogs/create-blog-form";

export default function CreateBlogPage() {
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

      <div className="flex flex-col gap-1.5 pb-6 border-b border-[#F5F5F5] mt-4">
        <h2 className="text-[22px] font-black text-black">إضافة مقال جديد</h2>
        <p className="text-[13px] text-gray-500 font-medium">
          أنشئ مقالاً جديداً وحدد وقت النشر أو احفظه كمسودة
        </p>
      </div>

      <div className="bg-white rounded-[24px] border border-[#E4E4E4] p-6 shadow-sm">
        <CreateBlogForm />
      </div>
    </div>
  );
}
