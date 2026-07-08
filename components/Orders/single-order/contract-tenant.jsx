import { Copy } from "lucide-react";
import { toast } from "sonner";
import { ContractStepEditor } from "./contract-edit/contract-step-editor";
import {
  STEP3_TENANT_FIELDS,
  STEP3_CONTRACT_META_FIELDS,
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

function ContractTenant({ data }) {
  const contractMeta = [
    { label: "نوع العقــد", value: data?.contract_summary?.contract_type || "---", borderColor: "border-blue-500" },
    { label: "تــاريخ بدء العقــد", value: data?.step4?.contract_starting_date || "---", borderColor: "border-purple-500" },
    { label: "مــدة العقــد", value: data?.contract_summary?.contract_period || data?.contract_summary?.contract_period_id || "---", borderColor: "border-gray-200" },
  ];

  const tenantDetails = [
    {
      label: "صلاحيات المستأجر",
      value: data?.step3?.tenant_role_names?.join?.("، ") || data?.step3?.tenant_role_names || "---",
      icon: <Copy size={14} />,
      borderColor: "border-blue-500",
    },
    { label: "رقــم هويـة المستأجر", value: data?.step3?.tenant_id_num || "---", icon: <Copy size={14} />, borderColor: "border-yellow-400" },
    { label: "تــاريخ ميـلاد المستأجر", value: data?.step3?.tenant_dob || "---", borderColor: "border-blue-600" },
    { label: "رقـم جــوال المستأجر", value: data?.step3?.tenant_mobile || "---", icon: <Copy size={14} />, borderColor: "border-green-500" },
  ];

  return (
    <div dir="rtl">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-gray-100/50 p-6 rounded-[28px] border border-gray-100">
          <ContractStepEditor
            title="نوع العقد / تاريخ بدء العقد"
            step="step3"
            fields={STEP3_CONTRACT_META_FIELDS}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contractMeta.map((item, index) => (
                <DetailCard key={index} {...item} />
              ))}
            </div>
          </ContractStepEditor>
        </div>

        <div className="bg-gray-100/50 p-6 rounded-[28px] border border-gray-100">
          <ContractStepEditor title="تفاصيل المستأجر" step="step3" fields={STEP3_TENANT_FIELDS}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tenantDetails.map((item, index) => (
                <DetailCard key={index} {...item} />
              ))}
            </div>
          </ContractStepEditor>
        </div>
      </div>
    </div>
  );
}

export default ContractTenant;
