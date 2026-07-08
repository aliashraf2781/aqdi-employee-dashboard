export const INSTRUMENT_TYPE_OWNER_ENDOWMENT = "property_ownership_owner_is_endowment";

export const INSTRUMENT_TYPES = [
  "electronic",
  "old_handwritten",
  "strong_argument",
  "electronic_tax_register",
  "property_ownership_owner_are_deceased_endowment",
  INSTRUMENT_TYPE_OWNER_ENDOWMENT,
  "sale_agreement",
  "electronic_deed_from_the_ministry_of_justice",
  "economic_cities_authority_suspended",
  "sublease_agreement",
  "lease_renewal",
  "property_ownership_owner_are_suspended",
  "property_ownership_owner_are_deceased",
];

const INSTRUMENT_TYPE_LABELS = {
  electronic: "صك إلكتروني",
  old_handwritten: "صك ورقي صادر من وزارة العدل",
  strong_argument: "حجة إستحكام",
  electronic_tax_register: "سجل ضريبي إلكتروني",
  property_ownership_owner_are_deceased_endowment: "وقف ورثة متوفين",
  [INSTRUMENT_TYPE_OWNER_ENDOWMENT]: "صك عقار والمالك وقف",
  sale_agreement: "ورقة مبايعة",
  electronic_deed_from_the_ministry_of_justice:
    "صك إلكتروني صادر من وزارة العدل و السجل العيني",
  economic_cities_authority_suspended: "هيئة المدن الاقتصادية - معلق",
  sublease_agreement: "عقد إيجار من الباطن",
  lease_renewal: "تجديد إيجار",
  property_ownership_owner_are_suspended: "ملكية عقار - معلق",
  property_ownership_owner_are_deceased: "ملكية عقار - متوفى",
};

export function getInstrumentTypeLabel(type) {
  if (!type) return "—";
  return INSTRUMENT_TYPE_LABELS[type] || type;
}

export function getInstrumentTypeOptions() {
  return INSTRUMENT_TYPES.map((value) => ({
    value,
    label: getInstrumentTypeLabel(value),
  }));
}
