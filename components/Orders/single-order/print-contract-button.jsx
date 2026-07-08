"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { printOrderContract } from "./print-contract";

export default function PrintContractButton({ orderData }) {
  const handlePrint = () => {
    if (!orderData) {
      toast.error("لا توجد بيانات للطباعة");
      return;
    }

    const opened = printOrderContract(orderData);
    if (!opened) {
      toast.error("تعذر فتح نافذة الطباعة");
    }
  };

  return (
    <Button
      type="button"
      onClick={handlePrint}
      disabled={!orderData}
      className="h-auto py-3 px-4 rounded-2xl bg-[#0c6055] hover:bg-[#0a5248] text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap shrink-0"
    >
      <Printer className="size-4" />
      طباعة العقد
    </Button>
  );
}
