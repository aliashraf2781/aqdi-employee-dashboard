"use client";

import Header from "@/components/home/Header";
import Loader from "@/components/home/loader";
import BlogForm from "@/components/analysis/settings/blogs/blog-form";
import { axiosInstance } from "@/src/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function EditBlogPage() {
  const params = useParams();
  const blogId = params?.id;

  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: () =>
      axiosInstance.get(`/admin/blogs/${blogId}`).then((res) => res?.data),
    enabled: Boolean(blogId),
  });

  const blog = responseData?.data;

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !blog) {
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
        <p className="text-center text-[#A3A3A3] mt-10">تعذر تحميل المقال.</p>
      </div>
    );
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

      <div className="flex flex-col gap-1.5 pb-6 border-b border-[#F5F5F5] mt-4">
        <h2 className="text-[22px] font-black text-black">تعديل المقال</h2>
        <p className="text-[13px] text-gray-500 font-medium">تحديث بيانات المقال وخيارات النشر</p>
      </div>

      <div className="bg-white rounded-[24px] border border-[#E4E4E4] p-6 shadow-sm">
        <BlogForm blogId={blogId} blog={blog} />
      </div>
    </div>
  );
}
