"use client";

import React from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { ContractStepEditor } from "./contract-edit/contract-step-editor";
import { STEP1_ADDRESS_FIELDS } from "./contract-edit/contract-field-schemas";

const OrderSectionErrorMenu = dynamic(
  () => import("@/components/Orders/messages/order-section-error-menu"),
  { ssr: false }
);

const copy = (value) => {
  if (!value) return;
  navigator.clipboard.writeText(String(value));
  toast.success("تم النسخ بنجاح");
};

const DetailCard = ({ label, value, icon, borderColor = "border-gray-200" }) => (
  <div
    className={`bg-white p-4 rounded-[16px] shadow-sm flex items-center justify-between border-r-4 ${borderColor} relative transition-all hover:shadow-md`}
  >
    <div className="flex flex-col gap-1 text-right w-full">
      <span className="text-gray-400 text-xs font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {icon && (
          <div className="text-gray-400 cursor-pointer" onClick={() => copy(value)}>
            {icon}
          </div>
        )}
        <span className="text-gray-800 font-bold text-sm lg:text-base">{value}</span>
      </div>
    </div>
  </div>
);

const hasValue = (value) => value !== null && value !== undefined && value !== "";

const PropertyLocationMap = ({ latitude, longitude }) => {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&hl=ar&z=15&output=embed`;

  return (
    <div className="overflow-hidden rounded-[16px] border border-gray-200">
      <iframe
        title="موقع العقار"
        src={mapSrc}
        className="h-[320px] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
};

export default function PropertyDetails({ data }) {
  const step1 = data?.step1 ?? {};

  const nationalAddress = [
    {
      label: "المدينة",
      value: step1.city_name || step1.property_city_id,
      icon: <Copy size={14} />,
      borderColor: "border-blue-500",
    },
    {
      label: "المنطقة",
      value: step1.property_place_name || step1.property_place_id,
      icon: <Copy size={14} />,
      borderColor: "border-pink-500",
    },
    { label: "الشارع", value: step1.street, icon: <Copy size={14} />, borderColor: "border-orange-500" },
    { label: "الحي", value: step1.neighborhood, icon: <Copy size={14} />, borderColor: "border-purple-500" },
    { label: "رقم الإضافي", value: step1.extra_figure, icon: <Copy size={14} />, borderColor: "border-green-500" },
    { label: "رقم المبنى", value: step1.building_number, icon: <Copy size={14} />, borderColor: "border-blue-400" },
    { label: "الرمز البريدي", value: step1.postal_code, icon: <Copy size={14} />, borderColor: "border-gray-800" },
  ].filter((item) => hasValue(item.value));

  const hasCoordinates = hasValue(step1.latitude) && hasValue(step1.longitude);
  const showLocationSection = nationalAddress.length > 0 || hasCoordinates;

  if (!showLocationSection) return null;

  return (
    <div dir="rtl">
      <ContractStepEditor
        title="العنوان الوطني للعقار"
        step="step1"
        fields={STEP1_ADDRESS_FIELDS}
      >
        <div className="flex justify-between gap-4 items-start">
          <div className="bg-gray-100/50 p-6 rounded-[28px] border border-gray-100 space-y-4 flex-1">
            {nationalAddress.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nationalAddress.map((item, index) => (
                  <DetailCard key={index} {...item} />
                ))}
              </div>
            )}
            {hasCoordinates && (
              <PropertyLocationMap latitude={step1.latitude} longitude={step1.longitude} />
            )}
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
