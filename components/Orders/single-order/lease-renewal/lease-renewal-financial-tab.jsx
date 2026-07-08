"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, ChevronLeft, Copy, Edit, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SectionEditHeader = ({ title, showEdit = true }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-[14px] font-black text-black">{title}</h3>
    {showEdit && (
      <button
        type="button"
        className="flex items-center gap-1 text-[#10B981] text-[11px] font-bold"
        onClick={() => toast.info("تعديل")}
      >
        <Edit className="size-3.5" />
        تعديل
      </button>
    )}
  </div>
);

const MoneyCard = ({ label, value, accent = "border-[#10B981]" }) => (
  <div className={`bg-white rounded-2xl p-4 shadow-sm border-r-[3px] ${accent}`}>
    <div className="flex items-center justify-between gap-2">
      <Wallet className="size-5 text-[#3B82F6] shrink-0" />
      <div className="text-right flex-1 min-w-0">
        <p className="text-[11px] text-[#9E9E9E] mb-0.5">{label}</p>
        <p className="text-[15px] font-black text-black">{value}</p>
      </div>
    </div>
  </div>
);

const InactiveCard = ({ label }) => (
  <div className="bg-[#ECECEC] rounded-2xl p-4 opacity-70 border-r-[3px] border-r-[#BDBDBD]">
    <div className="flex items-center justify-between gap-2">
      <X className="size-5 text-[#FF4D4F] shrink-0" />
      <p className="text-[13px] font-bold text-[#9E9E9E] text-right flex-1">{label}</p>
    </div>
  </div>
);

const PermissionCard = ({ label, active }) =>
  active ? (
    <div className="bg-white rounded-2xl p-4 shadow-sm border-r-[3px] border-r-[#9C27B0]">
      <div className="flex items-center justify-between gap-2">
        <Check className="size-5 text-[#10B981] shrink-0" />
        <p className="text-[13px] font-bold text-black text-right flex-1">{label}</p>
      </div>
    </div>
  ) : (
    <InactiveCard label={label} />
  );

export default function LeaseRenewalFinancialTab({ orderData }) {
  const [draftNumber, setDraftNumber] = useState("");
  const step4 = orderData?.step4 ?? {};

  const totalValue =
    step4.contract_term_in_years?.price ||
    step4.annual_rent_amount_for_the_unit ||
    "5000000";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Col 1 — البيانات المالية (rightmost in RTL) */}
      <div className="bg-[#F4F4F4] rounded-[20px] p-4">
        <SectionEditHeader title="البيانات المالية" />
        <div className="space-y-3">
          <MoneyCard label="إجمالي قيمة العقد" value={totalValue} accent="border-[#10B981]" />
          <MoneyCard
            label="طريقة الدفعات"
            value={step4.payment_type_name || "شهري"}
            accent="border-[#BDBDBD]"
          />
          <div className="bg-white rounded-2xl p-4 shadow-sm border-r-[3px] border-r-[#10B981]">
            <div className="flex items-start justify-between gap-2">
              <Check className="size-5 text-[#10B981] shrink-0 mt-0.5" />
              <div className="text-right flex-1 min-w-0">
                <p className="text-[11px] text-[#9E9E9E] mb-1">عداد الكهرباء</p>
                <p className="text-[12px] font-bold text-[#10B981] mb-2">مطلوب نقل العداد</p>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("GAJ929292929292929");
                      toast.success("تم النسخ");
                    }}
                    className="text-[#A3A3A3] hover:text-brand-main"
                  >
                    <Copy className="size-3.5" />
                  </button>
                  <p className="text-[11px] font-mono text-black break-all" dir="ltr">
                    GAJ929292929292929
                  </p>
                </div>
              </div>
            </div>
          </div>
          <InactiveCard label="عداد المياه" />
        </div>
      </div>

      {/* Col 2 — مبالغ إضافية */}
      <div className="bg-[#F4F4F4] rounded-[20px] p-4">
        <SectionEditHeader title="مبالغ إضافية" />
        <div className="space-y-3">
          <MoneyCard label="مبلغ الضمان" value="1000" accent="border-[#10B981]" />
          <InactiveCard label="الغرامة اليومية" />
          <MoneyCard label="المبالغ المقدمة" value="1000000" accent="border-[#3B82F6]" />
        </div>
      </div>

      {/* Col 3 — الصلاحيات */}
      <div className="bg-[#F4F4F4] rounded-[20px] p-4">
        <SectionEditHeader title="الصلاحيات" />
        <div className="space-y-3">
          <PermissionCard label="التأجير من الباطن" active />
          <PermissionCard label="الترميمات والتحسينات" active />
          <PermissionCard label="مراجعة الجهات الحكومية" active={false} />
          <PermissionCard label="تعديل الوحدة الإيجارية" active={false} />
        </div>
      </div>

      {/* Col 4 — تحويل الطلب (leftmost in RTL) */}
      <div className="bg-[#F4F4F4] rounded-[20px] p-4 flex flex-col h-fit">
        <SectionEditHeader title="تحويل الطلب" showEdit={false} />
        <button
          type="button"
          className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-[#FFE8EE] border border-[#FFD6E0] text-[#E91E8C] text-[12px] font-bold mb-5"
        >
          <span className="flex items-center gap-2">
            <span>🥳</span>
            بانتظار اعتماد العقد
          </span>
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-[13px] font-black text-black mb-2 text-right">رقم مسودة العقد</p>
        <Input
          placeholder="أدخل رقم مسودة العقد هنا..."
          value={draftNumber}
          onChange={(e) => setDraftNumber(e.target.value)}
          className="h-12 rounded-xl bg-white border-[#E0E0E0] text-right mb-4"
        />
        <Button
          type="button"
          className="w-full h-12 rounded-xl bg-[#0019FF] hover:bg-[#0015CC] font-bold text-white "
          onClick={() => toast.success("تم الحفظ")}
        >
          حفظ
        </Button>
      </div>
    </div>
  );
}
