"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderSectionErrorDialog from "./order-section-error-dialog";

export default function OrderSectionErrorMenu({
  label = "إرسال خطأ",
  orderData,
  context,
  buttonClassName = "text-xs px-4 py-3 bg-pink-200 text-pink-600 rounded-full gap-2 h-auto font-semibold",
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        className={buttonClassName}
        onClick={() => setDialogOpen(true)}
      >
        <Bell className="size-4 shrink-0" />
        {label}
      </Button>

      <OrderSectionErrorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        orderData={orderData}
        context={context}
      />
    </>
  );
}
