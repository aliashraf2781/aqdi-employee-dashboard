export const CONTRACT_PAID_API = "/admin/contract-paid-by-employees";
export const CONTRACT_PAID_QUERY_KEY = "contractPaidByEmployees";

export function normalizeContractPaidList(response) {
  const payload = response?.data?.data ?? response?.data ?? response;

  if (Array.isArray(payload?.items)) {
    return { items: payload.items, pagination: payload.pagination ?? null };
  }

  if (Array.isArray(payload)) {
    return { items: payload, pagination: null };
  }

  return { items: [], pagination: null };
}

export function extractContractPaidRecord(response) {
  const payload = response?.data?.data ?? response?.data ?? response;
  return payload?.record ?? payload ?? null;
}

export function extractPaymentFromResponse(response) {
  const payload = response?.data?.data ?? response?.data ?? response;
  const paymentUrl = payload?.payment_url || payload?.Payment_url;

  return {
    paymentUrl,
    cartAmount: payload?.cart_amount ?? payload?.record?.amount,
    record: payload?.record ?? payload,
    contractUuid: payload?.contract_uuid ?? payload?.record?.contract_uuid,
  };
}
