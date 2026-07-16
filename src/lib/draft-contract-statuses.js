export const DRAFT_CONTRACT_STATUSES_API = "/admin/draft-contract-statuses";
export const DRAFT_CONTRACT_STATUSES_QUERY_KEY = "draft-contract-statuses";

export const DRAFT_ORDERS_API = "/admin/orders/draft";
export const DRAFT_ORDERS_BY_STATUS_API = "/admin/orders/draft/status";

export const emptyDraftStatusForm = {
  name: "",
  color_text: "#000000",
  color: "#000000",
};

export function extractDraftStatusItems(response) {
  const body = response?.data;
  return body?.data?.items ?? body?.data?.data?.items ?? body?.items ?? [];
}

export function getDraftOrdersByStatusUrl(statusId) {
  return `${DRAFT_ORDERS_BY_STATUS_API}/${statusId}`;
}

export function getDraftOrderStatusLabel(row = {}) {
  return (
    row?.draft_contract_status?.name ??
    row?.draft_contract_status_name ??
    row?.status?.name ??
    row?.contract_status_name ??
    "—"
  );
}

export function getDraftOrderStatusColor(row = {}) {
  return (
    row?.draft_contract_status?.color ??
    row?.draft_contract_status_color ??
    row?.status?.color
  );
}

export function getDraftOrderStatusTextColor(row = {}) {
  return (
    row?.draft_contract_status?.color_text ??
    row?.draft_contract_status_color_text ??
    row?.status?.color_text
  );
}

export function getOrderDraftStatusFromDetail(orderData = {}) {
  const summary = orderData?.contract_summary ?? {};
  return {
    id:
      orderData?.draft_contract_status_id ??
      orderData?.draft_contract_status?.id ??
      summary?.draft_contract_status_id ??
      summary?.draft_contract_status?.id ??
      null,
    name: getDraftOrderStatusLabel({ ...summary, ...orderData }),
    color: getDraftOrderStatusColor({ ...summary, ...orderData }),
    colorText: getDraftOrderStatusTextColor({ ...summary, ...orderData }),
  };
}

export function getOrderDraftContractNumber(orderData = {}) {
  const summary = orderData?.contract_summary ?? {};
  return (
    orderData?.draft_contract_number ??
    summary?.draft_contract_number ??
    ""
  );
}

function isTruthyFlag(value) {
  return value === true || value === 1 || value === "1";
}

function textLooksLikeDraft(value) {
  const text = String(value ?? "")
    .trim()
    .toLowerCase();
  if (!text) return false;
  return (
    text === "draft" ||
    text.includes("draft") ||
    text.includes("مسود")
  );
}

/** Detect draft-contract rows in mixed order lists / related contracts. */
export function isDraftOrderRow(row = {}) {
  if (!row) return false;

  const summary = row.contract_summary ?? {};
  const sources = [row, summary];

  for (const item of sources) {
    if (!item || typeof item !== "object") continue;

    if (isTruthyFlag(item.is_draft) || isTruthyFlag(item.is_draft_contract)) {
      return true;
    }
    if (isTruthyFlag(item.is_draft_order) || isTruthyFlag(item.from_draft)) {
      return true;
    }

    if (
      textLooksLikeDraft(item.order_type) ||
      textLooksLikeDraft(item.type) ||
      textLooksLikeDraft(item.source) ||
      textLooksLikeDraft(item.category)
    ) {
      return true;
    }

    if (item.draft_contract_status_id || item.draft_contract_status?.id) {
      return true;
    }
    if (item.draft_contract_status_name || item.draft_contract_status?.name) {
      return true;
    }

    if (
      textLooksLikeDraft(item.status?.name) ||
      textLooksLikeDraft(item.contract_status_name) ||
      textLooksLikeDraft(item.status_name)
    ) {
      return true;
    }

    if (
      textLooksLikeDraft(item.instrument_type_key) ||
      textLooksLikeDraft(item.instrument_type)
    ) {
      return true;
    }
  }

  return false;
}

function parseHexColor(value = "") {
  const hex = String(value).trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
    };
  }
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }
  return null;
}

/** Soft row background tint from a draft status color. */
export function getDraftRowHighlightStyle(color) {
  const rgb = parseHexColor(color);
  if (!rgb) {
    return {
      backgroundColor: "#FFFBEB",
      boxShadow: "inset -3px 0 0 #F59E0B",
    };
  }
  return {
    backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`,
    boxShadow: `inset -3px 0 0 ${color}`,
  };
}
