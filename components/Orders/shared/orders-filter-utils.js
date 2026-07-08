export const emptyAdvancedFilters = {
  uuid: "",
  user_mobile: "",
  contract_type: "",
  instrument_type: "",
  employee_name: "",
  payment_status: "",
  amount_min: "",
  amount_max: "",
  date_from: "",
  date_to: "",
  status_name: "",
};

const includesMatch = (value, query) => {
  if (!query) return true;
  return String(value ?? "")
    .toLowerCase()
    .includes(String(query).toLowerCase().trim());
};

const parseAmount = (value) => {
  const num = parseFloat(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isNaN(num) ? null : num;
};

export function applyAdvancedFilters(orders, filters, { showStatusColumn = true } = {}) {
  if (!filters) return orders;

  return orders.filter((order) => {
    if (!includesMatch(order.uuid, filters.uuid)) return false;
    if (!includesMatch(order.user_mobile, filters.user_mobile)) return false;
    if (!includesMatch(order.contract_type, filters.contract_type)) return false;
    if (!includesMatch(order.instrument_type, filters.instrument_type)) return false;
    if (!includesMatch(order.employee_name, filters.employee_name)) return false;

    if (showStatusColumn && filters.status_name) {
      if (!includesMatch(order.status?.name, filters.status_name)) return false;
    }

    if (filters.payment_status === "paid") {
      if (!(order.is_paid === true || order.payment_status === "paid")) return false;
    }
    if (filters.payment_status === "unpaid") {
      if (order.is_paid === true || order.payment_status === "paid") return false;
    }

    const amount = parseAmount(order.amount_payment);
    const min = parseAmount(filters.amount_min);
    const max = parseAmount(filters.amount_max);
    if (min != null && (amount == null || amount < min)) return false;
    if (max != null && (amount == null || amount > max)) return false;

    if (filters.date_from || filters.date_to) {
      const orderDate = new Date(order.updated_at || order.created_at || order.payment_date);
      if (Number.isNaN(orderDate.getTime())) return false;
      if (filters.date_from) {
        const from = new Date(filters.date_from);
        from.setHours(0, 0, 0, 0);
        if (orderDate < from) return false;
      }
      if (filters.date_to) {
        const to = new Date(filters.date_to);
        to.setHours(23, 59, 59, 999);
        if (orderDate > to) return false;
      }
    }

    return true;
  });
}

export function hasActiveAdvancedFilters(filters) {
  return Object.values(filters ?? {}).some((value) => String(value ?? "").trim() !== "");
}
