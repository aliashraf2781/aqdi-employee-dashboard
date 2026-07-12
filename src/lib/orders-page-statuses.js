export const ORDERS_PAGE_STATUS_FILTERS = [
  { label: "جديد", match: ["جديد"] },
  { label: "استرجاع", match: ["استرجاع", "مسترج"] },
  { label: "ملغى", match: ["ملغى", "ملغي", "ملغ"] },
  { label: "معلق", match: ["معلق", "معلّق"] },
  { label: "مستلم", match: ["مستلم", "استلام"] },
  { label: "تم التوثيق", match: ["تم التوثيق", "توثيق", "موثق"] },
];

function normalizeStatusName(value = "") {
  return String(value).trim().replace(/\s+/g, " ");
}

function matchesStatusName(name, patterns = []) {
  const normalized = normalizeStatusName(name);
  return patterns.some(
    (pattern) =>
      normalized === pattern ||
      normalized.includes(pattern) ||
      pattern.includes(normalized)
  );
}

export function filterOrdersPageStatusItems(statusItems = []) {
  const items = Array.isArray(statusItems) ? statusItems : [];

  return ORDERS_PAGE_STATUS_FILTERS.map(({ label, match }) => {
    const found = items.find((item) => matchesStatusName(item?.name, match));
    if (!found) return null;
    return { ...found, name: label };
  }).filter(Boolean);
}
