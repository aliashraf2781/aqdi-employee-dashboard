"use client";

import { Check, ExternalLink } from "lucide-react";
import { BiSolidCopy } from "react-icons/bi";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function PaymentLinkDialog({ open, onOpenChange, paymentUrl, cartAmount }) {
  const amountLabel =
    cartAmount != null && cartAmount !== ""
      ? ` — المبلغ: ${cartAmount} ر.س`
      : "";

  const handleCopy = async () => {
    if (!paymentUrl) return;
    await navigator.clipboard.writeText(paymentUrl);
    toast.success("تم نسخ رابط الدفع");
  };

  const handleOpen = () => {
    if (!paymentUrl) return;
    window.open(paymentUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[480px] rounded-[28px] border border-[#B8E6C1] bg-[#E6FFE6] p-6 sm:p-8"
        dir="rtl"
        closeButton={false}
      >
        <div className="flex flex-col items-center text-center w-full">
          <div className="mb-4 flex size-[60px] items-center justify-center rounded-full bg-[#10B981] text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]">
            <Check className="size-7 stroke-[3]" />
          </div>

          <h2 className="mb-2 text-[18px] font-bold leading-snug text-[#007C13]">
            تم إنشاء رابط الدفع بنجاح{amountLabel}
          </h2>

          <p className="mb-5 text-[13px] text-[#007C13]/80">
            يمكنك نسخ الرابط أو فتح صفحة الدفع مباشرة
          </p>

          <div className="mb-6 w-full rounded-2xl border border-[#B8E6C1] bg-white/70 p-4 text-right">
            <p className="break-all text-[12px] font-medium leading-relaxed text-[#007C13]" dir="ltr">
              {paymentUrl}
            </p>
          </div>

          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="flex h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl bg-black text-[14px] font-bold text-white transition-colors hover:bg-neutral-800"
            >
              <BiSolidCopy size={18} />
              نسخ
            </button>
            <button
              type="button"
              onClick={handleOpen}
              className="flex h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl border border-[#10B981] bg-white text-[14px] font-bold text-[#007C13] transition-colors hover:bg-[#10B981]/10"
            >
              <ExternalLink className="size-4" />
              فتح
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
