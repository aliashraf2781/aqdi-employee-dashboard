"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import PaymentLinkDialog from "@/components/Orders/shared/payment-link-dialog";
import {
  CONTRACT_PAID_API,
  CONTRACT_PAID_QUERY_KEY,
  extractPaymentFromResponse,
} from "@/components/Orders/contract-paid/contract-paid-utils";
import { axiosInstance } from "@/src/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link2, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateContractPaidDialog() {
  const [open, setOpen] = useState(false);
  const [customerMobile, setCustomerMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentLink, setPaymentLink] = useState({ paymentUrl: "", cartAmount: null });
  const queryClient = useQueryClient();

  const resetForm = () => {
    setCustomerMobile("");
    setAmount("");
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axiosInstance.post(CONTRACT_PAID_API, {
        customer_mobile: customerMobile.trim(),
        amount: Number(amount),
      }),
    onSuccess: (res) => {
      const { paymentUrl, cartAmount } = extractPaymentFromResponse(res.data);

      if (!paymentUrl) {
        toast.error(res?.data?.message || "لم يتم إرجاع رابط الدفع");
        return;
      }

      toast.success(res?.data?.message || "تم إنشاء العقد ورابط الدفع بنجاح");
      setOpen(false);
      resetForm();
      setPaymentLink({ paymentUrl, cartAmount });
      setPaymentDialogOpen(true);
      queryClient.invalidateQueries({ queryKey: [CONTRACT_PAID_QUERY_KEY] });
    },
    onError: (error) => {
      const data = error?.response?.data;
      toast.error(
        data?.gateway_error || data?.message || "حدث خطأ أثناء إنشاء العقد"
      );
    },
  });

  const handleSubmit = () => {
    if (!customerMobile.trim()) {
      toast.error("رقم جوال العميل مطلوب");
      return;
    }

    const parsedAmount = Number(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("يرجى إدخال مبلغ صحيح");
      return;
    }

    mutate();
  };

  return (
    <>
      <Dialog
        dir="rtl"
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) resetForm();
        }}
      >
        <DialogTrigger asChild>
          <Button className="bg-brand-hover hover:bg-brand-hover/90 text-white h-12 rounded-full font-bold px-6 gap-2 whitespace-nowrap">
            إنشاء عقد مدفوع
            <Plus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent closeButton={false} className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between border-b pb-6">
              <h2 className="text-xl font-bold">إنشاء عقد مدفوع</h2>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4 text-right">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  رقم جوال العميل <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="05xxxxxxxx"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  className="h-12"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  المبلغ <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="500.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12"
                  dir="ltr"
                />
              </div>

              <Button
                disabled={isPending || !customerMobile.trim() || !amount}
                onClick={handleSubmit}
                className="mx-auto block h-12 w-full bg-brand-hover gap-2"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Link2 className="size-4" />
                    إنشاء + رابط الدفع
                  </>
                )}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <PaymentLinkDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        paymentUrl={paymentLink.paymentUrl}
        cartAmount={paymentLink.cartAmount}
      />
    </>
  );
}
