/** بيانات الطلب المستخدمة في إرسال الخطأ عبر واتساب (منفصلة عن رسائل الأقسام) */

export function getOrderSectionFields(orderData, context) {
  const summary = orderData?.contract_summary ?? {};
  const orderId = orderData?.uuid ?? orderData?.id ?? summary?.id;

  if (context === "owner") {
    return [
      { label: "رقم الطلب", value: orderId },
      { label: "اسم المالك", value: summary.name_owner },
      { label: "رقم الهوية", value: summary.property_owner_id_num },
      { label: "تاريخ الميلاد", value: summary.property_owner_dob },
      { label: "رقم الجوال", value: summary.property_owner_mobile },
      { label: "ايبان المالك", value: summary.property_owner_iban },
      { label: "المنطقة", value: summary.relation_labels?.property_region },
      { label: "المدينة", value: summary.relation_labels?.property_city },
      { label: "الحي", value: summary.neighborhood },
      { label: "الشارع", value: summary.street },
    ];
  }

  if (context === "agent") {
    return [
      { label: "رقم الطلب", value: orderId },
      {
        label: "اسم الوكيل",
        value:
          summary.name_of_property_owner_agent ??
          summary.property_owner_agent_name ??
          summary.name_owner,
      },
      { label: "رقم الهوية", value: summary.id_num_of_property_owner_agent },
      { label: "تاريخ الميلاد", value: summary.dob_of_property_owner_agent },
      { label: "رقم الجوال", value: summary.mobile_of_property_owner_agent },
    ];
  }

  const step1 = orderData?.step1 ?? {};

  if (context === "propertyAddress") {
    return [
      { label: "رقم الطلب", value: orderId },
      { label: "المدينة", value: step1.city_name || step1.property_city_id },
      { label: "المنطقة", value: step1.property_place_name || step1.property_place_id },
      { label: "الحي", value: step1.neighborhood },
      { label: "الشارع", value: step1.street },
      { label: "رقم المبنى", value: step1.building_number },
      { label: "رقم الإضافي", value: step1.extra_figure },
      { label: "الرمز البريدي", value: step1.postal_code },
      { label: "خط العرض", value: step1.latitude },
      { label: "خط الطول", value: step1.longitude },
    ];
  }

  if (context === "propertyDetails") {
    return [
      { label: "رقم الطلب", value: orderId },
      { label: "استخدام العقار", value: step1.property_usages_name },
      { label: "نوع العقار", value: step1.property_type_name },
      { label: "إجمالي عدد الوحدات في كل طابق", value: step1.number_of_units_per_floor },
      { label: "إجمالي عدد الطوابق", value: step1.number_of_floors },
      { label: "عمر العقار", value: step1.age_of_the_property },
      { label: "إجمالي عدد الوحدات في العقار", value: step1.number_of_units_in_realestate },
      { label: "إسم مالك العقار", value: summary.name_owner },
    ];
  }

  return [];
}

export function formatSectionDataBlock(fields) {
  return fields
    .filter(({ value }) => value !== null && value !== undefined && value !== "")
    .map(({ label, value }) => `\t•\t${label}: ${value}`)
    .join("\n");
}

export function getOrderContractUuid(orderData) {
  const summary = orderData?.contract_summary ?? {};
  return (
    orderData?.uuid ??
    orderData?.contract_uuid ??
    summary?.uuid ??
    summary?.contract_uuid ??
    ""
  );
}

export function getOrderId(orderData) {
  const summary = orderData?.contract_summary ?? {};
  return getOrderContractUuid(orderData) || orderData?.id || summary?.id || "";
}

export function normalizeWhatsAppPhone(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("966")) return digits;
  if (digits.startsWith("0")) return `966${digits.slice(1)}`;
  if (digits.length === 9) return `966${digits}`;
  return digits;
}

export function buildWhatsAppUrl(phone, messageText) {
  const normalized = normalizeWhatsAppPhone(phone);
  if (!normalized) return null;
  const text = encodeURIComponent(messageText || "");
  return `https://wa.me/${normalized}${text ? `?text=${text}` : ""}`;
}

export function getOrderClientPhone(orderData) {
  return getOrderPhoneForContext(orderData, "owner");
}

export function getOrderPhoneForContext(orderData, context) {
  const summary = orderData?.contract_summary ?? {};

  if (context === "agent") {
    return summary?.mobile_of_property_owner_agent || "";
  }

  return (
    summary?.property_owner_mobile ||
    orderData?.user?.mobile ||
    orderData?.user_mobile ||
    ""
  );
}

export function getWhatsAppRecipientLabel(context) {
  if (context === "agent") return "الوكيل";
  return "العميل";
}
