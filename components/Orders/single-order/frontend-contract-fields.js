/**
 * Fields the mobile/frontend actually submits across contract steps.
 * Dashboard sections should display only these (empty → faded).
 */

export const INSTRUMENT_IMAGE_FIELDS = [
  { key: "image_instrument", label: "صورة الصك" },
  { key: "image_instrument_from_the_front", label: "صورة الصك (من الأمام)" },
  { key: "image_instrument_from_the_back", label: "صورة الصك (من الخلف)" },
  {
    key: "Image_inheritance_certificate",
    label: "شهادة حصر الإرث",
  },
  {
    key: "copy_power_of_attorney_from_heirs_to_agent",
    label: "توكيل الورثة للوكيل",
  },
  {
    key: "copy_of_the_endowment_registration_certificate",
    label: "شهادة تسجيل الوقف",
  },
  {
    key: "copy_of_the_trusteeship_deed",
    label: "صك النظارة",
  },
  {
    key: "copy_of_guardians_power_of_attorney_for_agent",
    label: "توكيل الأولياء للوكيل",
  },
];

export const ADDRESS_FIELDS = [
  { key: "property_place_id", label: "المنطقة", preferLabel: true },
  { key: "property_city_id", label: "المدينة", preferLabel: true },
  { key: "neighborhood", label: "الحي" },
  { key: "street", label: "الشارع" },
  { key: "building_number", label: "رقم المبنى" },
  { key: "postal_code", label: "الرمز البريدي" },
  { key: "extra_figure", label: "الرقم الإضافي" },
  { key: "address_url", label: "رابط العنوان" },
];

/** Yes/no / presence helpers matching frontend "0"|"1"|boolean payloads. */
export function asYesNo(value) {
  if (value === true || value === 1 || value === "1") return "نعم";
  if (value === false || value === 0 || value === "0") return "لا";
  return value;
}

export function pickFirst(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
}

export function resolveAddressFieldValue(orderData, field) {
  const step1 = orderData?.step1 || {};
  const labels = orderData?.relation_labels || {};

  if (field.key === "property_place_id") {
    return pickFirst(
      labels.property_region,
      orderData?.property_region?.name_trans,
      orderData?.property_region?.name_ar,
      orderData?.property_region?.name,
      step1.property_place_id,
      orderData?.property_place_id
    );
  }

  if (field.key === "property_city_id") {
    return pickFirst(
      labels.property_city,
      orderData?.property_city?.name_trans,
      orderData?.property_city?.name_ar,
      orderData?.property_city?.name,
      step1.property_city_id,
      orderData?.property_city_id
    );
  }

  if (field.key === "latitude") {
    return pickFirst(step1.latitude, orderData?.latitude, step1.lat, orderData?.lat);
  }

  if (field.key === "longitude") {
    return pickFirst(step1.longitude, orderData?.longitude, step1.lng, orderData?.lng);
  }

  return pickFirst(step1[field.key], orderData?.[field.key]);
}
