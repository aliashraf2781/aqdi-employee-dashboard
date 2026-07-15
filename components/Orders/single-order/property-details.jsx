"use client";

import React from "react";
import Image from "next/image";
import { Copy, Home, Link2, ExternalLink, Inbox, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractStepEditor } from "./contract-edit/contract-step-editor";
import { STEP1_ADDRESS_FIELDS } from "./contract-edit/contract-field-schemas";
import { useImageZoomPan } from "./use-image-zoom-pan";
import {
  formatDisplayValue,
  isEmptyDisplayValue,
} from "./contract-summary-view";
import {
  ADDRESS_FIELDS,
  pickFirst,
  resolveAddressFieldValue,
} from "./frontend-contract-fields";

const OrderSectionErrorMenu = dynamic(
  () => import("@/components/Orders/messages/order-section-error-menu"),
  { ssr: false }
);

const BORDER_COLORS = [
  "border-blue-500",
  "border-pink-500",
  "border-orange-500",
  "border-purple-500",
  "border-green-500",
  "border-blue-400",
  "border-gray-800",
  "border-slate-500",
  "border-teal-500",
  "border-indigo-500",
];

const copy = (value) => {
  if (isEmptyDisplayValue(value)) return;
  navigator.clipboard.writeText(String(value));
  toast.success("تم النسخ بنجاح");
};

const DetailCard = ({
  label,
  value,
  copyable = false,
  borderColor = "border-gray-200",
}) => {
  const empty = isEmptyDisplayValue(value);
  return (
    <div
      className={`rounded-[16px] border-r-4 bg-white p-4 shadow-sm ${borderColor} ${
        empty ? "opacity-45" : ""
      }`}
    >
      <span className="mb-1 block text-right text-xs font-medium text-gray-400">
        {label}
      </span>
      <p
        className={`flex items-center justify-end gap-2 text-sm font-bold lg:text-base ${
          empty ? "text-[#A3A3A3]" : "text-gray-800"
        }`}
      >
        {copyable && !empty ? (
          <button
            type="button"
            onClick={() => copy(value)}
            className="text-gray-400 hover:text-brand-main"
            title="نسخ"
          >
            <Copy size={14} />
          </button>
        ) : null}
        <span>{formatDisplayValue(value)}</span>
      </p>
    </div>
  );
};

const resolveImageUrl = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "object") {
    return value.url || value.path || value.full_url || value.src || null;
  }
  return null;
};

const NoData = ({ label = "لا توجد بيانات" }) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-gray-200 bg-white px-4 py-14 text-[#A3A3A3] opacity-45">
    <Inbox size={28} className="text-gray-300" />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const AddressImageViewer = ({ src }) => {
  const {
    scale,
    position,
    containerRef,
    handleMouseDown,
    resetTransform,
    cursorClass,
  } = useImageZoomPan({
    enabled: Boolean(src),
    resetDeps: [src],
  });

  return (
    <div className="overflow-hidden rounded-[16px] border border-gray-200 bg-[#E8E8E8]">
      <div
        ref={containerRef}
        className={`flex min-h-[320px] items-center justify-center p-4 ${cursorClass}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={resetTransform}
      >
        <div
          className="relative will-change-transform"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center center",
            transition:
              cursorClass === "cursor-grabbing" ? "none" : "transform 0.15s ease-out",
          }}
        >
          <Image
            src={src}
            alt="صورة العنوان"
            width={720}
            height={540}
            className="h-auto max-h-[min(56vh,480px)] w-auto max-w-full select-none object-contain"
            draggable={false}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

const AddressUrlCard = ({ url }) => {
  const empty = isEmptyDisplayValue(url);
  if (empty) {
    return <NoData label="لا يوجد رابط لموقع العقار" />;
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-[16px] border-r-4 border-blue-500 bg-white p-4 shadow-sm">
      <div className="min-w-0 flex-1 text-right">
        <span className="text-xs font-medium text-gray-400">رابط الموقع</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          dir="ltr"
          className="mt-1 block truncate text-sm font-bold text-brand-hover hover:underline lg:text-base"
          title={url}
        >
          {url}
        </a>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-gray-400">
        <button
          type="button"
          onClick={() => copy(url)}
          title="نسخ الرابط"
          className="hover:text-gray-600"
        >
          <Copy size={16} />
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title="فتح الرابط"
          className="hover:text-gray-600"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

export default function PropertyDetails({ data }) {
  const step1 = data?.step1 ?? {};

  const nationalAddress = ADDRESS_FIELDS.filter(
    (field) => !["address_url"].includes(field.key)
  ).map((field, index) => ({
    label: field.label,
    value: resolveAddressFieldValue(data, field),
    borderColor: BORDER_COLORS[index % BORDER_COLORS.length],
    copyable: true,
  }));

  const addressUrl = pickFirst(step1.address_url, data?.address_url);
  const imageAddress = resolveImageUrl(
    pickFirst(step1.image_address, data?.image_address)
  );

  const tabs = [
    {
      value: "national-address",
      label: "تفاصيل العنوان",
      icon: <Home size={16} />,
      content: (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {nationalAddress.map((item) => (
            <DetailCard key={item.label} {...item} />
          ))}
        </div>
      ),
    },
    {
      value: "image-address",
      label: "صورة العنوان",
      icon: <ImageIcon size={16} />,
      content: imageAddress ? (
        <AddressImageViewer src={imageAddress} />
      ) : (
        <NoData label="لا توجد صورة للعنوان" />
      ),
    },
    {
      value: "address-url",
      label: "رابط الموقع",
      icon: <Link2 size={16} />,
      content: <AddressUrlCard url={addressUrl} />,
    },
  ];

  return (
    <div dir="rtl" className="space-y-6">
      <ContractStepEditor
        title="العنوان الوطني للعقار"
        step="step1"
        fields={STEP1_ADDRESS_FIELDS}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 rounded-[28px] border border-gray-100 bg-gray-100/50 p-6">
            <Tabs defaultValue={tabs[0].value} dir="rtl">
              <TabsList className="mb-4 h-fit w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-500 shadow-none transition-colors data-[state=active]:border-transparent data-[state=active]:bg-brand-hover data-[state=active]:text-white"
                  >
                    {tab.icon}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="mt-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  {tab.content}
                </TabsContent>
              ))}
            </Tabs>
          </div>
          <OrderSectionErrorMenu
            label="إرسال خطأ للعميل"
            orderData={data}
            context="propertyAddress"
          />
        </div>
      </ContractStepEditor>
    </div>
  );
}
