import * as XLSX from "xlsx";
import { axiosInstance } from "@/src/utils/axios";

function formatPaymentValue(row) {
  const isPaid =
    row?.is_paid === true ||
    row?.is_paid === 1 ||
    (row?.amount_payment && row?.is_paid !== false && row?.is_paid !== 0);

  if (!isPaid) {
    return row?.payment_label_ar || "لم يتم الدفع";
  }

  return row?.amount_payment ?? "";
}

function formatDateValue(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ar-SA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function mapOrderToExportRow(order, { showStatusColumn = true } = {}) {
  const row = {
    "رقم الطلب": order?.uuid ?? "",
    "رقم جوال العميل": order?.user_mobile ?? "",
    "نوع العقد": order?.contract_type ?? "",
    "نوع الوثيقة": order?.instrument_type ?? "",
    الدفع: formatPaymentValue(order),
    "مستلم منذ": formatDateValue(order?.updated_at),
  };

  if (showStatusColumn) {
    row["حالة الطلب"] =
      order?.status?.name || order?.contract_status_name || "قيد المعالجة";
  }

  row.الاستلام = order?.employee_name ?? "";

  return row;
}

export function exportOrdersToExcel(orders, { filename = "orders", showStatusColumn = true } = {}) {
  if (!orders?.length) {
    return false;
  }

  const rows = orders.map((order) => mapOrderToExportRow(order, { showStatusColumn }));
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "الطلبات");

  const dateStamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `${filename}-${dateStamp}.xlsx`);
  return true;
}

function withPerPage(url, perPage) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}per_page=${perPage}`;
}

export async function fetchAllPaginatedOrders(buildUrl) {
  const perPage = 100;
  const firstResponse = await axiosInstance(withPerPage(buildUrl(1), perPage));
  const firstBody = firstResponse?.data?.data;
  const items = [...(firstBody?.items ?? [])];
  const lastPage = firstBody?.pagination?.last_page ?? 1;

  for (let page = 2; page <= lastPage; page += 1) {
    const response = await axiosInstance(withPerPage(buildUrl(page), perPage));
    const pageItems = response?.data?.data?.items ?? [];
    items.push(...pageItems);
  }

  return items;
}
