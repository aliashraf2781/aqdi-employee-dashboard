import { useCallback, useMemo, useState } from "react";

export function useOrdersSelection() {
  const [selected, setSelected] = useState({});

  const toggle = useCallback((order) => {
    if (!order?.id) return;
    setSelected((prev) => {
      const next = { ...prev };
      if (next[order.id]) {
        delete next[order.id];
      } else {
        next[order.id] = order;
      }
      return next;
    });
  }, []);

  const togglePage = useCallback((orders, checked) => {
    setSelected((prev) => {
      const next = { ...prev };
      orders.forEach((order) => {
        if (!order?.id) return;
        if (checked) {
          next[order.id] = order;
        } else {
          delete next[order.id];
        }
      });
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected({}), []);

  const selectedOrders = useMemo(() => Object.values(selected), [selected]);
  const selectedCount = selectedOrders.length;

  const isSelected = useCallback((id) => Boolean(selected[id]), [selected]);

  const getPageSelectionState = useCallback(
    (orders) => {
      if (!orders?.length) return { all: false, some: false };
      const selectedOnPage = orders.filter((order) => selected[order.id]).length;
      return {
        all: selectedOnPage === orders.length,
        some: selectedOnPage > 0 && selectedOnPage < orders.length,
      };
    },
    [selected]
  );

  return {
    selectedOrders,
    selectedCount,
    isSelected,
    toggle,
    togglePage,
    clear,
    getPageSelectionState,
  };
}
