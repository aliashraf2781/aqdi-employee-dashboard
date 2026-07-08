"use client";

import AddNewMessageForClientDialog from "@/components/analysis/settings/message-for-clients/add-message-for-client";
import DisplayMessageForClientDialog from "@/components/analysis/settings/message-for-clients/display-message-for-client";
import Header from "@/components/home/Header";
import Loader from "@/components/home/loader";
import { Button } from "@/components/ui/button";
import { useCustomerMessages } from "@/src/hooks/use-customer-messages";
import { axiosInstance } from "@/src/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const PAGE_TITLE = "رسائل التطبيقية للعميل";
const PAGE_PATH = "/home/settings/customer-app-messages";

export default function CustomerAppMessagesPage() {
  const queryClient = useQueryClient();
  const { messages, isLoading } = useCustomerMessages("client");

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.post(`/admin/customer-messages/${id}/delete`),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "تم حذف الرسالة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["customer-messages"] });
      queryClient.invalidateQueries({ queryKey: ["message-alerts-client"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حذف الرسالة");
    },
  });

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <Header
        page="welcome"
        title="الإعـدادات"
        isMain={false}
        first="الرئيــسية"
        firstURL="/"
        second="الإعـدادات"
        secondURL="/home/settings"
        third={PAGE_TITLE}
        thirdURL={PAGE_PATH}
      />

      <div className="flex items-center justify-between mt-6">
        <h2 className="text-xl font-bold">{PAGE_TITLE} :</h2>
        <AddNewMessageForClientDialog />
      </div>

      {!messages.length ? (
        <p className="text-sm text-[#A3A3A3] mt-8 text-center">لا توجد رسائل</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
          {messages.map((item) => (
            <div
              key={item.id}
              className="bg-gray-200 rounded-[16px] border border-[#E4E4E4] p-4 min-h-[180px] flex flex-col transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <Button
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(item.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg h-9 w-9 p-0 flex items-center justify-center shrink-0"
                >
                  {deleteMutation.isPending && deleteMutation.variables === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </Button>
                <p className="text-sm font-bold text-[#616161] text-right">
                  {item.section?.name_ar || item.section?.name_en || "بدون قسم"}
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center py-6">
                <p className="text-base font-bold text-center text-[#1A1A1A]">
                  {item.section_item?.name_ar || item.section_item?.name_en || "بدون بند"}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2">
                <DisplayMessageForClientDialog messageAlert={item} />
                <AddNewMessageForClientDialog isEdit messageAlert={item} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
