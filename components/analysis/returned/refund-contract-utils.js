import { axiosInstance } from "@/src/utils/axios";

export function mapCreatedAtFilter(id) {
  if (!id || id === "total") return "all";
  if (id === "day") return "today";
  return id;
}

export function getReturnAnalysisTitle(id) {
  switch (id) {
    case "day":
      return "مسترجع اليــوم";
    case "week":
      return "مسترجع الأسبوع";
    case "month":
      return "مسترجع الشهر";
    case "year":
      return "مسترجع السنة";
    case "total":
      return "إجمالي المسترجع";
    default:
      return "مسترجع اليــوم";
  }
}

/** API uses `false` for pending, `true` when admin approved (`accept_retrun_contract`). */
export function isAdminRefundApproved(value) {
  return value === true || value === 1;
}

export function isReturnContractOrder(order) {
  return order?.return_contract === true;
}

export function getOrderAdminApprovalStatus(order) {
  return (
    order?.accept_retrun_contract ??
    order?.accept_return_contract ??
    order?.admin_confirmed
  );
}

export function canManageAdminRefund(refund) {
  if (!refund) return false;
  if (refund.returnContract) {
    return !isAdminRefundApproved(refund.adminConfirmed);
  }
  return !isAdminRefundApproved(refund.adminConfirmed);
}

export function buildRefundsLookup(refundItems) {
  const map = new Map();
  const list = Array.isArray(refundItems) ? refundItems : [];

  for (const item of list) {
    const normalized = normalizeRefundContract(item);
    if (!normalized?.refundId) continue;

    const contract = item.contract ?? {};

    map.set(normalized.refundId, normalized);
    if (normalized.contractId != null) {
      map.set(normalized.contractId, normalized);
      map.set(String(normalized.contractId), normalized);
    }
    if (contract.id != null) {
      map.set(contract.id, normalized);
      map.set(String(contract.id), normalized);
    }
    if (normalized.orderUuid) {
      map.set(normalized.orderUuid, normalized);
    }
    if (contract.uuid) {
      map.set(contract.uuid, normalized);
    }
  }

  return map;
}

export function resolveRefundForOrder(order, refundsLookup) {
  const fromOrder = normalizeRefundFromOrder(order);
  if (fromOrder?.refundId) return fromOrder;
  if (!order || !refundsLookup?.size) return null;

  return (
    refundsLookup.get(order.id) ??
    refundsLookup.get(String(order.id)) ??
    refundsLookup.get(order.contract_id) ??
    refundsLookup.get(order.uuid) ??
    null
  );
}

/** Build refund row from return-orders list item when nested refund exists. */
export function normalizeRefundFromOrder(order) {
  if (!order) return null;

  const nested =
    order.refundable_contract ??
    order.refund ??
    (Array.isArray(order.refundable_contracts) ? order.refundable_contracts[0] : null);

  if (nested) {
    const normalized = normalizeRefundContract(nested);
    if (normalized?.refundId) return normalized;
  }

  const refundId = order.refund_id ?? order.refundable_contract_id;
  if (refundId) {
    return normalizeRefundContract({
      id: refundId,
      contract_id: order.contract_id ?? order.id,
      refund_amount: order.refund_amount,
      admin_confirmed: getOrderAdminApprovalStatus(order),
      reference_number: order.refund_reference ?? order.reference_number,
      contract: order,
      ...order,
    });
  }

  if (isReturnContractOrder(order)) {
    return normalizeRefundContract({
      id: order.refund_id ?? order.id,
      contract_id: order.contract_id ?? order.id,
      uuid: order.uuid,
      user_mobile: order.user_mobile,
      contract_type: order.contract_type,
      contract_type_key: order.contract_type_key,
      amount_payment: order.amount_payment,
      is_paid: order.is_paid,
      payment_label_ar: order.payment_label_ar,
      refund_amount: order.refund_amount,
      admin_confirmed: getOrderAdminApprovalStatus(order),
      draft_contract_number: order.draft_contract_number,
      employee_name: order.employee_name,
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
      return_contract: true,
    });
  }

  return null;
}

export function normalizeRefundContract(item) {
  if (!item) return null;
  const contract = item.contract ?? {};

  return {
    id: item.id,
    refundId: item.id,
    orderUuid:
      contract.uuid ??
      item.contract_uuid ??
      item.uuid ??
      item.order_number ??
      "—",
    userMobile:
      contract.user?.phone ??
      contract.user_mobile ??
      item.user_mobile ??
      item.customer_mobile ??
      "",
    contractType:
      contract.contract_type ??
      item.contract_type ??
      "—",
    contractTypeKey: contract.contract_type_key ?? item.contract_type_key,
    amountPayment:
      contract.amount_payment ?? item.amount_payment ?? item.payment_amount,
    isPaid: contract.is_paid ?? item.is_paid,
    paymentLabelAr: contract.payment_label_ar ?? item.payment_label_ar,
    refundAmount: item.refund_amount,
    adminConfirmed: item.admin_confirmed,
    customerRefunded: item.customer_refunded ?? item.is_refunded ?? item.refunded,
    employeeName:
      contract.employee?.name ??
      item.employee_name ??
      item.raised_by_name ??
      item.raised_by ??
      "—",
    statusName: contract.status?.name ?? item.status?.name ?? item.status_name,
    statusColor: contract.status?.color ?? item.status?.color,
    referenceNumber: item.reference_number ?? item.refund_reference,
    notes: item.notes,
    createdAt: item.created_at ?? contract.created_at,
    updatedAt: item.updated_at ?? contract.updated_at,
    contractId: item.contract_id ?? contract.id ?? item.id,
    draftContractNumber: item.draft_contract_number,
    returnContract: item.return_contract === true,
    raw: item,
  };
}

export function formatRelativeTimeAr(dateString) {
  if (!dateString) return "—";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes}د`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} س`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (days >= 1 && remainingHours > 0) return `منذ ${days} يوم و ${remainingHours} س`;
  if (days >= 1) return `منذ ${days} يوم`;
  return `منذ ${hours} س`;
}

export function buildRefundApprovedCustomerMessage(refund) {
  const amount = refund?.refundAmount ?? "—";
  const reference = refund?.referenceNumber ?? "—";
  const orderNumber = refund?.orderUuid ?? "—";

  return `عميلنا العزيز،

نود إبلاغكم بأنه تم استرجاع المبلغ بنجاح
المبلغ: ${amount}
الرقم المرجعي: ${reference}
رقم الطلب: ${orderNumber}

شكراً لتفهمكم.`;
}

export function updateRefundContract(refundId, body) {
  return axiosInstance.post(`/admin/analytics/refunds/contracts/${refundId}`, body);
}
