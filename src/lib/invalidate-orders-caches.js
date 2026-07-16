import { DRAFT_CONTRACT_STATUSES_QUERY_KEY } from "@/src/lib/draft-contract-statuses";

/** List / analysis query roots that can go stale after an order mutation. */
const ORDER_LIST_ROOTS = [
  "orders",
  "completedOrders",
  "receivedOrders",
  "canceledOrders",
  "reliableOrders",
  "draftCompletedOrders",
  "returnOrders",
  "contractPaidByEmployees",
  "inCompletedOrders",
  "orders-whatsapp-completed",
  "orders-whatsapp-incompleted",
];

function toKey(queryKey) {
  if (!queryKey) return null;
  return Array.isArray(queryKey) ? queryKey : [queryKey];
}

function invalidate(queryClient, queryKey) {
  const key = toKey(queryKey);
  if (!key) return;
  queryClient.invalidateQueries({ queryKey: key });
}

function invalidateSingleOrder(queryClient, orderId) {
  if (orderId == null || orderId === "") return;
  invalidate(queryClient, ["single-order", orderId]);
  const asString = String(orderId);
  if (asString !== orderId) {
    invalidate(queryClient, ["single-order", asString]);
  }
}

/**
 * Refresh regular order lists, tab counts, and optional detail cache.
 * Call after contract-status change, delete, accept, etc.
 */
export function invalidateOrdersCaches(queryClient, { queryKey, orderId } = {}) {
  for (const root of ORDER_LIST_ROOTS) {
    invalidate(queryClient, [root]);
  }

  invalidate(queryClient, ["orders-all-total"]);
  invalidate(queryClient, ["order-status-count"]);
  invalidate(queryClient, ["unReceivedOrders"]);
  invalidate(queryClient, ["unReceivedOrdersTotal"]);
  invalidate(queryClient, ["dashboard-analytics-quick"]);

  invalidateSingleOrder(queryClient, orderId);
  invalidate(queryClient, queryKey);
}

/**
 * Refresh draft lists, draft tab counts, and optional status definitions.
 */
export function invalidateDraftOrdersCaches(
  queryClient,
  { queryKey, orderId, includeStatusDefinitions = false } = {}
) {
  invalidate(queryClient, ["draftContracts"]);
  invalidate(queryClient, ["draftCompletedOrders"]);
  invalidate(queryClient, ["draft-orders-all-total"]);
  invalidate(queryClient, ["draft-order-status-count"]);

  if (includeStatusDefinitions) {
    invalidate(queryClient, [DRAFT_CONTRACT_STATUSES_QUERY_KEY]);
    invalidate(queryClient, ["draft-contract-statuses-active"]);
  }

  invalidateSingleOrder(queryClient, orderId);
  invalidate(queryClient, queryKey);
}

/**
 * Refresh refund / return flows plus the underlying order caches.
 */
export function invalidateRefundCaches(queryClient, { queryKey, orderId } = {}) {
  invalidateOrdersCaches(queryClient, { queryKey, orderId });
  invalidate(queryClient, ["refundContracts"]);
  invalidate(queryClient, ["refundContractsLookup"]);
  invalidate(queryClient, ["returnOrders"]);
  invalidate(queryClient, ["status"]);
}
