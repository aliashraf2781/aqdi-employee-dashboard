"use client";



import { Copy, Loader2 } from "lucide-react";

import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { useContractPeriods } from "@/src/hooks/use-contract-periods";

import {

  formatContractPeriodPrice,

  getContractPeriodLabel,

  getContractTypeLabel,

} from "@/src/lib/contract-period-utils";



function copyPeriod(period) {

  const label = getContractPeriodLabel(period);

  const price = formatContractPeriodPrice(period?.price);

  const text = price ? `المدة: ${label}\nالسعر: ${price}` : `المدة: ${label}`;



  navigator.clipboard.writeText(text);

  toast.success("تم نسخ البيانات");

}



export default function OrderContractPeriodsDialog({ open, onOpenChange }) {

  const { groups, isLoading, hasPeriods } = useContractPeriods(open);



  return (

    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent

        closeButton={false}

        dir="rtl"

        className="sm:max-w-[560px] p-8 sm:p-10 rounded-[28px] border-0 shadow-[0_24px_48px_rgba(0,0,0,0.12)]"

      >

        <div className="flex items-center justify-between mb-6">

          <button

            type="button"

            onClick={() => onOpenChange(false)}

            className="text-[#737373] hover:text-black transition-colors text-xl leading-none w-8 h-8 flex items-center justify-center"

            aria-label="إغلاق"

          >

            ✕

          </button>

          <h2 className="text-[22px] font-bold text-black">الأسعار</h2>

        </div>



        {isLoading ? (

          <div className="flex items-center justify-center py-16">

            <Loader2 className="size-6 animate-spin text-[#A3A3A3]" />

          </div>

        ) : !hasPeriods ? (

          <p className="text-[14px] text-[#A3A3A3] text-center py-12">لا توجد أسعار</p>

        ) : (

          <div className="space-y-6 max-h-[min(60vh,420px)] overflow-y-auto">

            {groups.map((group) => (

              <div key={group.id}>

                <p className="text-[14px] font-bold text-[#1A1A1A] mb-4">{group.name}</p>

                {group.sections.map((section) => (

                  <div key={`${group.id}-${section.id}`} className="mb-5 last:mb-0">

                    <p className="text-[12px] font-bold text-[#737373] mb-3">{section.name}</p>

                    <div className="space-y-3">

                      {section.items.map((period) => (

                        <div

                          key={period.id}

                          className="bg-[#F5F5F5] rounded-[16px] p-4 flex items-center justify-between gap-4"

                        >

                          <div className="flex-1 min-w-0 text-right space-y-1">

                            <p className="text-[12px] text-[#737373]">المدة</p>

                            <p className="text-[14px] font-semibold text-[#1A1A1A] leading-snug">

                              {getContractPeriodLabel(period)}

                            </p>

                            <p className="text-[12px] text-[#737373] pt-2">السعر</p>

                            <p className="text-[16px] font-bold text-brand-main">

                              {formatContractPeriodPrice(period?.price) || "—"}

                            </p>

                            <p className="text-[11px] text-[#A3A3A3]">

                              {getContractTypeLabel(period?.contract_type || group.id)}

                            </p>

                          </div>

                          <button

                            type="button"

                            onClick={() => copyPeriod(period)}

                            className="shrink-0 flex items-center justify-center w-10 h-10 rounded-[12px] bg-white border border-[#E8E8E8] text-[#737373] hover:text-[#1D4ED8] hover:border-[#1D4ED8] transition-colors"

                            aria-label="نسخ"

                          >

                            <Copy className="size-4" strokeWidth={2.5} />

                          </button>

                        </div>

                      ))}

                    </div>

                  </div>

                ))}

              </div>

            ))}

          </div>

        )}

      </DialogContent>

    </Dialog>

  );

}

