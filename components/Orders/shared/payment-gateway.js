import { axiosInstance } from "@/src/utils/axios";

export async function fetchContractPaymentLink(uuid) {
  const response = await axiosInstance.get(
    `/admin/payment-gateway/${encodeURIComponent(uuid)}`,
    { headers: { Accept: "application/json" } }
  );

  const data = response?.data;
  const paymentUrl = data?.payment_url || data?.Payment_url;

  if (!paymentUrl) {
    const error = new Error(
      data?.message || data?.gateway_error || "لم يتم إرجاع رابط الدفع"
    );
    error.response = response;
    throw error;
  }

  return {
    paymentUrl,
    contractUuid: data?.contract_uuid ?? uuid,
    cartAmount: data?.cart_amount,
  };
}
