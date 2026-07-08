import { useQueries } from "@tanstack/react-query";
import { axiosInstance } from "@/src/utils/axios";

const extractTotal = (response) => {
  const body = response?.data;
  return (
    body?.data?.data?.pagination?.total ??
    body?.data?.pagination?.total ??
    0
  );
};

const fetchListTotal = async (url) => {
  const separator = url.includes("?") ? "&" : "?";
  const response = await axiosInstance(`${url}${separator}page=1&per_page=1`);
  return extractTotal(response);
};

export function useOrderStatusCounts(
  statusItems = [],
  { baseUrl, statusParam = "contract_status_id", extraParams = "" } = {}
) {
  const params = extraParams ? extraParams.replace(/^&/, "") : "";
  const allUrl = params ? `${baseUrl}?${params}` : baseUrl;

  const queries = useQueries({
    queries: [
      {
        queryKey: ["order-status-count", baseUrl, "all", params],
        queryFn: () => fetchListTotal(allUrl),
        enabled: Boolean(baseUrl),
      },
      ...(statusItems ?? []).map((item) => ({
        queryKey: ["order-status-count", baseUrl, item.id, params],
        queryFn: () =>
          fetchListTotal(
            `${baseUrl}?${statusParam}=${item.id}${params ? `&${params}` : ""}`
          ),
        enabled: Boolean(baseUrl && item?.id),
      })),
    ],
  });

  const allTotal = queries[0]?.data ?? 0;
  const byId = (statusItems ?? []).reduce((acc, item, index) => {
    acc[item.id] = queries[index + 1]?.data ?? 0;
    return acc;
  }, {});

  const isLoading = queries.some((query) => query.isLoading);

  return { allTotal, byId, isLoading };
}
