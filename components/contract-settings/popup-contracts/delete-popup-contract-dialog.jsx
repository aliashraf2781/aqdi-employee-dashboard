"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { axiosInstance } from "@/src/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getPopupInstrumentTypeLabel, POPUP_CONTRACTS_API, POPUP_CONTRACTS_QUERY_KEY } from "@/src/lib/popup-contracts";

export default function DeletePopupContractDialog({ item }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => axiosInstance.post(`${POPUP_CONTRACTS_API}/${item?.id}/delete`),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "تم حذف المحتوى الإرشادي بنجاح");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: [POPUP_CONTRACTS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء حذف المحتوى");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-9 rounded-full border-0 bg-[#FFEBEB] text-[#FF4D4F] hover:bg-[#FF4D4F] hover:text-white"
          title="حذف"
        >
          <Trash2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-hidden rounded-[32px] border-0 p-0 sm:max-w-[500px]"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-6 p-8 text-center">
          <div className="mt-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#FFEBEB] text-[#FF4D4F] shadow-inner">
            <Trash2 className="size-10" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-[22px] font-black text-black">
              هل أنت متأكد من حذف المحتوى الإرشادي؟
            </h3>
            <p className="mx-auto inline-block max-w-full rounded-full bg-[#FFEBEB] px-4 py-1.5 text-[15px] font-bold text-[#FF4D4F]">
              {getPopupInstrumentTypeLabel(item?.instrument_type)}
            </p>
          </div>
          <p className="text-[15px] font-medium text-[#737373]">
            هذا الإجراء لا يمكن التراجع عنه بعد الحذف.
          </p>
          <div className="mt-2 flex w-full items-center gap-4">
            <button
              type="button"
              onClick={() => mutate()}
              disabled={isPending}
              className="h-[54px] flex-1 rounded-[16px] bg-[#FF4D4F] text-[16px] font-bold text-white shadow-lg shadow-[#FF4D4F]/25 transition-all hover:bg-[#E03E3E] disabled:opacity-70"
            >
              {isPending ? <Loader2 className="mx-auto animate-spin" /> : "تأكيـد الحـذف"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-[54px] flex-1 rounded-[16px] bg-[#F5F5F5] text-[16px] font-bold text-[#737373] transition-all hover:bg-[#EEEEEE]"
            >
              إلغاء
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
