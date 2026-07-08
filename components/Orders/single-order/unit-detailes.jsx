import React from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { ContractStepEditor } from "./contract-edit/contract-step-editor";
import {
  STEP2_UNIT_FIELDS,
  STEP2_ROOM_FIELDS,
  STEP2_SERVICE_FIELDS,
} from "./contract-edit/contract-field-schemas";

const copy = (value) => {
  if (!value) return;
  navigator.clipboard.writeText(String(value));
  toast.success("تم النسخ بنجاح");
};

const DetailCard = ({ label, value, icon, borderColor = "border-gray-200", disabled = false }) => {
  const isZero = value === "لا يوجد" || value === 0;
  const isDisabled = disabled || isZero;

  return (
    <div
      className={`p-4 rounded-[16px] shadow-sm flex items-center justify-between relative transition-all bg-white ${
        isDisabled ? "opacity-60" : "hover:shadow-md"
      } ${!isDisabled ? `border-r-4 ${borderColor}` : "border-r-4 border-gray-300"}`}
    >
      <div className="flex flex-col gap-1 text-right w-full">
        <span className="text-gray-400 text-xs font-medium">{label}</span>
        <div className="flex items-center gap-2">
          {icon && (
            <div className="text-gray-400 cursor-pointer" onClick={() => copy(value)}>
              {icon}
            </div>
          )}
          <span className={`font-bold text-sm lg:text-base ${isDisabled ? "text-gray-400" : "text-gray-800"}`}>
            {value}
          </span>
        </div>
      </div>
    </div>
  );
};

const UnitDetailes = ({ data }) => {
  const unitGeneralDetails = [
    { label: "رقم الوحدة", value: data?.step2?.unit?.unit_number || data?.step2?.unit_number || "---", icon: <Copy size={14} />, borderColor: "border-blue-500" },
    { label: "نوع الوحدة", value: data?.step2?.unit_type_name || data?.step2?.unit_type?.name_ar || "---", borderColor: "border-yellow-400" },
    { label: "استخدام الوحدة", value: data?.step2?.unit_usage_name || data?.step2?.unit_usage?.name_ar || "---", borderColor: "border-blue-600" },
    { label: "رقم الطابق", value: data?.step2?.unit?.floor_number || data?.step2?.floor_number || "---", icon: <Copy size={14} />, borderColor: "border-green-500" },
    { label: "مساحة الوحدة", value: data?.step2?.unit?.unit_area || data?.step2?.unit_area || "---", icon: <Copy size={14} />, borderColor: "border-purple-500" },
    { label: "عدد الغرف", value: data?.step2?.tootal_rooms || "---", icon: <Copy size={14} />, borderColor: "border-orange-500" },
    { label: "مؤثثة..؟", value: data?.step2?.furnished ? "نعم" : "لا", borderColor: "border-sky-400" },
    { label: "مطبخ راكب", value: data?.step2?.kitchen_tank ? "نعم" : "لا", borderColor: "border-orange-600" },
  ];

  const roomDetails = [
    { label: "دورة مياه", value: data?.step2?.The_number_of_the_toilet || "---", borderColor: "border-blue-500" },
    { label: "غرفة النوم", value: data?.step2?.tootal_rooms || "---", borderColor: "border-red-400" },
    { label: "الصالة", value: data?.step2?.The_number_of_halls || "---", borderColor: "border-purple-500" },
    { label: "مكيف سبليت", value: data?.step2?.split_ac || "لا يوجد", borderColor: "border-gray-200" },
    { label: "مكيف شباك", value: data?.step2?.window_ac || "لا يوجد", borderColor: "border-blue-400" },
    { label: "مطبخ", value: data?.step2?.The_number_of_kitchens || "---", borderColor: "border-gray-200" },
  ];

  const services = [
    { label: "عداد الكهرباء", value: data?.step2?.electricity_meter_number || "---", icon: <Copy size={14} />, borderColor: "border-green-500" },
    { label: "عداد المياه", value: data?.step2?.water_meter_number || "---", icon: <Copy size={14} />, borderColor: "border-purple-600" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-8" dir="rtl">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-gray-100/50 p-6 rounded-[28px] border border-gray-100">
          <ContractStepEditor title="تفاصيل الغرف" step="step2" fields={STEP2_ROOM_FIELDS}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roomDetails.map((item, index) => (
                <DetailCard key={index} {...item} />
              ))}
            </div>
          </ContractStepEditor>
        </div>

        <div className="bg-gray-100/50 p-6 rounded-[28px] border border-gray-100">
          <ContractStepEditor title="تفاصيل الوحدات" step="step2" fields={STEP2_UNIT_FIELDS}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {unitGeneralDetails.map((item, index) => (
                <DetailCard key={index} {...item} />
              ))}
            </div>
          </ContractStepEditor>
        </div>
      </div>

      <div className="bg-gray-100/50 p-6 rounded-[28px] border border-gray-100">
        <ContractStepEditor title="الخدمات" step="step2" fields={STEP2_SERVICE_FIELDS}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((item, index) => (
              <DetailCard key={index} {...item} />
            ))}
          </div>
        </ContractStepEditor>
      </div>
    </div>
  );
};

export default UnitDetailes;
