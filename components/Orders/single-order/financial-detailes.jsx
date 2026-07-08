import { Copy } from "lucide-react";
import { toast } from "sonner";
import { ContractStepEditor } from "./contract-edit/contract-step-editor";
import {
  STEP4_FINANCIAL_FIELDS,
  STEP4_TERMS_FIELDS,
} from "./contract-edit/contract-field-schemas";

const copy = (value) => {
  if (!value) return;
  navigator.clipboard.writeText(String(value));
  toast.success("تم النسخ بنجاح");
};

const DetailCard = ({ label, value, icon, borderColor = "border-gray-200" }) => (
  <div
    className={`p-4 rounded-[16px] shadow-sm flex items-center justify-between relative transition-all bg-white hover:shadow-md border-r-4 ${borderColor}`}
  >
    <div className="flex flex-col gap-1 text-right w-full">
      <span className="text-gray-400 text-xs font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {icon && (
          <div className="text-gray-400 cursor-pointer" onClick={() => copy(value)}>
            {icon}
          </div>
        )}
        <span className="font-bold text-sm lg:text-base text-gray-800">{value}</span>
      </div>
    </div>
  </div>
);

function FinancialDetailes({ data }) {
  const financialDetails = [
    { label: "مبلغ الإيجار السنوي للوحدة", value: data?.step4?.annual_rent_amount_for_the_unit || "---", borderColor: "border-blue-500" },
    { label: "نـوع الدفع", value: data?.step4?.payment_type_name || data?.step4?.payment_type_id || "---", borderColor: "border-yellow-400" },
    { label: "الغرامة اليومية", value: data?.step4?.daily_fine || "---", borderColor: "border-red-400" },
    { label: "إجمالي السعر", value: data?.step4?.contract_term_in_years?.price || data?.step4?.contract_term_in_years || "---", borderColor: "border-green-500" },
  ];

  const contractDetails = [
    { label: "مدة العقد", value: data?.step4?.contract_term_name || "---", borderColor: "border-purple-500" },
    { label: "تاريخ بداية العقد", value: data?.step4?.contract_starting_date || "---", borderColor: "border-green-500" },
    {
      label: "نوع التاريخ",
      value: data?.step4?.type_contract_starting_date === "hijri" ? "هجري" : "ميلادي",
      borderColor: "border-sky-400",
    },
  ];

  const otherTerms = [
    { label: "شروط إضافية", value: data?.step4?.other_conditions || "لا يوجد", borderColor: "border-gray-300" },
    { label: "نص الشروط الإضافية", value: data?.step4?.text_additional_terms || "---", borderColor: "border-gray-300" },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-gray-100/50 p-6 rounded-[28px] border border-gray-100">
          <ContractStepEditor title="البيانات المالية" step="step4" fields={STEP4_FINANCIAL_FIELDS}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {financialDetails.map((item, index) => (
                <DetailCard key={index} {...item} />
              ))}
            </div>
          </ContractStepEditor>
        </div>

        <div className="bg-gray-100/50 p-6 rounded-[28px] border border-gray-100">
          <ContractStepEditor title="مدة العقد" step="step4" fields={STEP4_TERMS_FIELDS.filter((f) => ["contract_starting_date", "type_contract_starting_date", "contract_term_in_years"].includes(f.key))}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contractDetails.map((item, index) => (
                <DetailCard key={index} {...item} />
              ))}
            </div>
          </ContractStepEditor>
        </div>
      </div>

      <div className="bg-gray-100/50 p-6 rounded-[28px] border border-gray-100">
        <ContractStepEditor
          title="الشروط الإضافية"
          step="step4"
          fields={STEP4_TERMS_FIELDS.filter((f) =>
            ["other_conditions", "text_additional_terms", "notes_edits"].includes(f.key)
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherTerms.map((item, index) => (
              <DetailCard key={index} {...item} />
            ))}
          </div>
        </ContractStepEditor>
      </div>
    </div>
  );
}

export default FinancialDetailes;
