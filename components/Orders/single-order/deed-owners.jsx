"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import { BiEdit } from "react-icons/bi";
import { Eye, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { ContractStepEditor } from "./contract-edit/contract-step-editor";
import {
  SUMMARY_OWNER_FIELDS,
  SUMMARY_AGENT_FIELDS,
} from "./contract-edit/contract-field-schemas";
import {
  SECTION_ERROR_BUTTON_CLASS,
  SummaryFieldsLayout,
  SummaryInfoItem,
} from "./contract-summary-view";
import AgencyDocumentViewerDialog, {
  LegalAgentStatusBadge,
  resolveAgencyDocumentUrl,
} from "./agency-document-viewer-dialog";
import UserRelatedContracts from "./user-related-contracts";

const OrderSectionErrorMenu = dynamic(
  () => import("@/components/Orders/messages/order-section-error-menu"),
  { ssr: false }
);

const resolveImageUrl = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "object") {
    return value.url || value.path || value.full_url || value.src || null;
  }
  return null;
};

const INSTRUMENT_IMAGE_FIELDS = [
  { key: "image_instrument", label: "صورة الصك" },
  { key: "image_instrument_from_the_front", label: "صورة الصك من الأمام" },
  { key: "image_instrument_from_the_back", label: "صورة الصك من الخلف" },
  {
    key: "copy_power_of_attorney_from_heirs_to_agent",
    label: "نسخة الوكالة من الورثة للوكيل",
  },
  {
    key: "copy_of_the_endowment_registration_certificate",
    label: "نسخة شهادة تسجيل الوقف",
  },
  { key: "copy_of_the_trusteeship_deed", label: "نسخة صك النظارة" },
];

const copyToClipboard = (value) => {
  if (!value || value === "--") return;
  navigator.clipboard.writeText(String(value));
  toast.success("تم النسخ بنجاح");
};

function isPdfUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.split("?")[0].toLowerCase().endsWith(".pdf");
}

const DeedOwners = ({ data }) => {
  const galleryRef = useRef(null);
  const [agencyViewerOpen, setAgencyViewerOpen] = useState(false);

  const orderData = data?.contract_summary ?? {};
  const hasLegalAgent =
    orderData?.add_legal_agent_of_owner === 1 || data?.add_legal_agent_of_owner === 1;

  const agencyDocumentUrl = resolveAgencyDocumentUrl(orderData);
  const agencyIsPdf = isPdfUrl(agencyDocumentUrl);

  const images = INSTRUMENT_IMAGE_FIELDS.map(({ key, label }) => {
    const url = resolveImageUrl(orderData?.[key]);
    if (!url) return null;
    return {
      original: url,
      thumbnail: url,
      description: label,
      originalAlt: label,
    };
  }).filter(Boolean);

  const owner = {
    name: orderData?.name_owner,
    phone: orderData?.property_owner_mobile,
    birthDate: orderData?.property_owner_dob,
    nationalId: orderData?.property_owner_id_num,
    iban: orderData?.property_owner_iban,
  };

  const agent = {
    name:
      orderData?.name_of_property_owner_agent ??
      orderData?.property_owner_agent_name ??
      orderData?.name_owner,
    phone: orderData?.mobile_of_property_owner_agent,
    birthDate: orderData?.dob_of_property_owner_agent,
    nationalId: orderData?.id_num_of_property_owner_agent,
  };



  const openAgencyDocument = () => {
    if (!agencyDocumentUrl) {
      toast.error("لا يوجد ملف وكالة مرفق");
      return;
    }
    setAgencyViewerOpen(true);
  };

  return (
    <div className="flex items-start gap-4" dir="rtl">
      {images.length > 0 && (
        <div className="w-1/3 shrink-0">
          <div className="flex items-center gap-1 text-xs mb-2">
            <p className="text-[#4D4D4D]">صـورة الصك :</p>
            <Button variant="ghost" className="p-0 text-xs h-auto text-green-600 font-bold hover:text-green-700">
              <BiEdit size={16} className="text-green-500" />
              تعديل
            </Button>
          </div>
          <div dir="ltr" className="bg-[#E8E8E8] p-6 rounded-3xl">
            <ImageGallery ref={galleryRef} items={images} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 space-y-8">
        {/* بيانات الملاك */}
        <ContractStepEditor
          title="بيــانات المــلاك"
          step="summary"
          fields={SUMMARY_OWNER_FIELDS}
        >
          <SummaryFieldsLayout
            errorMenu={
              <OrderSectionErrorMenu
                label="إرسال خطأ"
                orderData={data}
                context="owner"
                buttonClassName={SECTION_ERROR_BUTTON_CLASS}
              />
            }
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
                <SummaryInfoItem
                  value={owner.nationalId}
                  label="رقم الهوية"
                  onCopy={copyToClipboard}
                />
                <SummaryInfoItem
                  value={owner.birthDate}
                  label="تاريخ الميلاد"
                  onCopy={copyToClipboard}
                />
                <SummaryInfoItem
                  value={owner.phone}
                  label="رقم الجوال"
                  onCopy={copyToClipboard}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
                <SummaryInfoItem
                  value={owner.name}
                  label="اسم المالك"
                  onCopy={copyToClipboard}
                />
                <div className="sm:col-span-2">
                  <SummaryInfoItem
                    value={owner.iban}
                    label="ايبان المالك"
                    onCopy={copyToClipboard}
                  />
                </div>
              </div>

              <UserRelatedContracts orderData={data} />
            </div>
          </SummaryFieldsLayout>
        </ContractStepEditor>

        {/* بيانات الوكيل */}

        {hasLegalAgent ? (
          <div className="bg-gray-100/50 p-6 rounded-[28px] border border-gray-100">
          <ContractStepEditor
            title="بيــانات الوكيل"
            step="summary"
            fields={SUMMARY_AGENT_FIELDS}
          >
            <div className="space-y-6">
              <SummaryFieldsLayout
                errorMenu={
                  <OrderSectionErrorMenu
                    label="إرسال خطأ للوكيل"
                    orderData={data}
                    context="agent"
                    buttonClassName={SECTION_ERROR_BUTTON_CLASS}
                  />
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-5">
                  <SummaryInfoItem
                    value={agent.nationalId}
                    label="رقم هوية الوكيل"
                    onCopy={copyToClipboard}
                  />
                  <SummaryInfoItem
                    value={agent.birthDate}
                    label="تاريخ ميلاد الوكيل"
                    onCopy={copyToClipboard}
                  />
                  <SummaryInfoItem
                    value={agent.phone}
                    label="رقم جوال الوكيل"
                    onCopy={copyToClipboard}
                  />
                  <SummaryInfoItem
                    value={agent.name}
                    label="اسم الوكيل"
                    onCopy={copyToClipboard}
                  />

                </div>
              </SummaryFieldsLayout>


              <div className="flex flex-wrap items-center gap-3 pt-1">
                <LegalAgentStatusBadge />

                {!agencyIsPdf && agencyDocumentUrl ? (
                  <button
                    type="button"
                    onClick={openAgencyDocument}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8E8E8] bg-white text-[13px] font-bold text-black hover:bg-[#FAFAFA] transition-colors shadow-sm"
                  >
                    <ImageIcon className="size-4" />
                    عرض صورة الوكالة
                  </button>
                ) : null}

                {agencyIsPdf && agencyDocumentUrl ? (
                  <button
                    type="button"
                    onClick={openAgencyDocument}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8E8E8] bg-white text-[13px] font-bold text-black hover:bg-[#FAFAFA] transition-colors shadow-sm"
                  >
                    <Eye className="size-4" />
                    عرض الوكالة PDF
                  </button>
                ) : null}
              </div>
            </div>
          </ContractStepEditor>
          </div>
        ) : null}
      </div>

      <AgencyDocumentViewerDialog
        open={agencyViewerOpen}
        onOpenChange={setAgencyViewerOpen}
        documentUrl={agencyDocumentUrl}
        title={agencyIsPdf ? "وكالة PDF" : "صورة الوكالة"}
      />
    </div>
  );
};

export default DeedOwners;
