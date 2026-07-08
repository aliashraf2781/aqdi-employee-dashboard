"use client";

import { Switch } from "@/components/ui/switch";

export default function InstructionImageCard({
  item,
  enabled,
  onToggle,
  onEdit,
  onView,
}) {
  return (
    <div className="bg-white rounded-[20px] border border-[#E4E4E4] p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#FFEBEB] text-[#FF4D4F] hover:bg-[#FF4D4F] hover:text-white transition-all whitespace-nowrap"
          >
            تعديل
          </button>
          <button
            type="button"
            onClick={() => onView(item)}
            className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#E6FFE6] text-[#10B981] hover:bg-[#10B981] hover:text-white transition-all whitespace-nowrap"
          >
            عرض
          </button>
        </div>

        <div className="flex-1 min-w-0 text-right">
          <h3 className="text-[13px] font-black text-black mb-1">{item.title}</h3>
          <p className="text-[11px] text-[#737373] leading-relaxed">{item.description}</p>
        </div>

        <Switch
          dir="ltr"
          checked={enabled}
          onCheckedChange={(checked) => onToggle(item.id, checked)}
          className="data-[state=checked]:bg-brand-main shrink-0 mt-0.5"
        />
      </div>
    </div>
  );
}
