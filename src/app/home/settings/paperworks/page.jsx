"use client";

import Header from "@/components/home/Header";
import AddPaperworkDialog from "@/components/analysis/settings/paperworks/add-paperwork-dialog";
import EditPaperworkDialog from "@/components/analysis/settings/paperworks/edit-paperwork-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePaperworks } from "@/src/hooks/use-paperworks";
import { axiosInstance } from "@/src/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, FileText, Pentagon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

function PaperworksGrid({ activeTab }) {
  const queryClient = useQueryClient();
  const { items, isLoading } = usePaperworks(activeTab);

  const { mutate: deletePaperwork, isPending: deletePending } = useMutation({
    mutationFn: (id) => axiosInstance.post(`/admin/paperworks/${id}/delete`),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "تم حذف ورقة العمل بنجاح");
      queryClient.invalidateQueries({ queryKey: ["paperworks", activeTab] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء حذف ورقة العمل");
    },
  });

  if (isLoading) {
    return <p className="text-sm text-[#A3A3A3] py-8">جاري التحميل...</p>;
  }

  if (!items.length) {
    return <p className="text-sm text-[#A3A3A3] py-8">لا توجد أوراق عمل</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-gray-200 rounded-[16px] border border-[#E4E4E4] p-4 transition-all"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-bold text-[#616161]">ورقة عمل</h3>
            <div className="relative size-10 shrink-0 rounded-xl overflow-hidden border border-[#E4E4E4] bg-white flex items-center justify-center">
              {item.icon_url ? (
                <Image
                  src={item.icon_url}
                  alt={item.name_ar || item.name || "أيقونة ورقة العمل"}
                  fill
                  className="object-contain p-1"
                />
              ) : (
                <FileText className="size-5 text-[#A3A3A3]" />
              )}
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-sm font-bold">{item.name_ar || item.name}</p>
            {item.name_en ? (
              <p className="text-xs text-[#737373]" dir="ltr">
                {item.name_en}
              </p>
            ) : null}
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <EditPaperworkDialog paperwork={item} />
            <Button
              disabled={deletePending}
              onClick={() => deletePaperwork(item.id)}
              className="bg-red-500/20 text-red-500 text-xs"
            >
              حذف
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PaperworksPage() {
  const [activeTab, setActiveTab] = useState("housing");

  return (
    <div className="p-6">
      <Header
        page="welcome"
        title="الإعـدادات"
        isMain={false}
        first="الرئيــسية"
        firstURL="/"
        second="الإعـدادات"
        secondURL="/home/settings"
        third="أوراق العمل"
        thirdURL="/home/settings/paperworks"
      />

      <Tabs dir="rtl" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-transparent gap-4">
            <TabsTrigger
              value="housing"
              className="data-[state=active]:bg-brand-hover data-[state=active]:text-white font-bold p-4 px-8 rounded-full gap-2 bg-gray-200"
            >
              <Pentagon className="w-4 h-4" />
              سكني
            </TabsTrigger>
            <TabsTrigger
              value="commercial"
              className="data-[state=active]:bg-brand-hover data-[state=active]:text-white font-bold p-4 px-8 rounded-full gap-2 bg-gray-200"
            >
              <Building2 className="w-4 h-4" />
              تجاري
            </TabsTrigger>
          </TabsList>
          <AddPaperworkDialog activeTab={activeTab} />
        </div>

        <TabsContent value="housing">
          <PaperworksGrid activeTab="housing" />
        </TabsContent>
        <TabsContent value="commercial">
          <PaperworksGrid activeTab="commercial" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
