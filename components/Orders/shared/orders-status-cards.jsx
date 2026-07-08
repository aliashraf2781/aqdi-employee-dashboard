"use client";

import Image from "next/image";
import waIcon from "@/public/images/waIcon.svg";

const getStatusEmoji = (name = "") => {
  if (name.includes("واتساب") && (name.includes("غير") || name.includes("غير مكتمل"))) return "⛔";
  if (name.includes("أخرى")) return "🤔";
  if (name.includes("معالجة")) return "🤔";
  if (name.includes("تأكيد") && name.includes("عقار")) return "⏳";
  if (name.includes("إجراء") && name.includes("عميل")) return null;
  if (name.includes("عميل") && !name.includes("تأكيد")) return null;
  if (name.includes("تم تأكيد")) return "🏡";
  if (name.includes("اعتماد")) return "🥳";
  if (name.includes("جديد")) return "🆕";
  if (name.includes("استرجاع") || name.includes("مسترج")) return "↩️";
  if (name.includes("ملغ")) return "❌";
  return "🤔";
};

const usesWhatsAppIcon = (name = "") =>
  name.includes("إجراء") && name.includes("عميل");

const getActionLabel = (name = "") => {
  if (name.includes("واتساب") && (name.includes("غير") || name.includes("غير مكتمل"))) {
    return "عرض";
  }
  return "تصفية";
};

const isViewAction = (label) => label === "عرض";

const formatCount = (count) => {
  if (count == null || count === "") return "00";
  const num = Number(count);
  if (Number.isNaN(num)) return "00";
  if (num > 99) return String(num);
  return String(num).padStart(2, "0");
};

function StatusIcon({ name }) {
  if (usesWhatsAppIcon(name)) {
    return (
      <Image src={waIcon} alt="" width={22} height={22} className="w-[22px] h-[22px] object-contain" />
    );
  }

  const emoji = getStatusEmoji(name);
  return <span className="text-[22px] leading-none">{emoji}</span>;
}

function StatusCard({ item, count, isActive, onClick, actionLabel }) {
  const viewAction = isViewAction(actionLabel);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-[#F5F5F5] rounded-[16px] border p-4 flex flex-col min-h-[118px] text-right transition-all hover:shadow-md ${
        isActive
          ? "border-brand-main shadow-md ring-2 ring-brand-main/15"
          : "border-transparent hover:border-[#E0E0E0]"
      }`}
    >
      <div className="flex justify-end w-full">
        <StatusIcon name={item.name} />
      </div>

      <p className="text-[11px] font-bold text-[#1A1A1A] leading-snug mt-2 min-h-[32px] flex-1">
        {item.name}
      </p>

      <div className="flex items-end justify-between gap-2 mt-3 w-full">
        <span
          className={`text-[11px] font-bold px-3 py-0.5 rounded-full shrink-0 ${
            viewAction
              ? "bg-white text-[#616161] border border-[#E0E0E0]"
              : "text-[#10B981] border border-[#10B981]"
          }`}
        >
          {actionLabel}
        </span>
        <span className="text-[32px] font-black text-black leading-none tabular-nums">
          {formatCount(count)}
        </span>
      </div>
    </button>
  );
}

export default function OrdersStatusCards({
  statusItems = [],
  activeFilter,
  onFilterChange,
  showAllCard = false,
  allTotal = 0,
  countsById = {},
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {showAllCard && (
        <StatusCard
          item={{ name: "الكل" }}
          count={allTotal}
          isActive={activeFilter === ""}
          actionLabel="تصفية"
          onClick={() => onFilterChange("")}
        />
      )}

      {statusItems?.map((item) => {
        const isActive = String(activeFilter) === String(item.id);
        const count =
          countsById[item.id] ??
          item.orders_count ??
          item.count ??
          item.total ??
          item.contracts_count ??
          0;

        return (
          <StatusCard
            key={item.id}
            item={item}
            count={count}
            isActive={isActive}
            actionLabel={getActionLabel(item.name)}
            onClick={() => onFilterChange(item.id)}
          />
        );
      })}
    </div>
  );
}
