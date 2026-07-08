"use client";

import { createContext, useContext } from "react";
import { useSingleOrder } from "./use-single-order";

const SingleOrderContext = createContext(null);

export function SingleOrderProvider({ contractId, children }) {
  const value = useSingleOrder(contractId);
  return (
    <SingleOrderContext.Provider value={value}>{children}</SingleOrderContext.Provider>
  );
}

export function useSingleOrderContext() {
  const ctx = useContext(SingleOrderContext);
  if (!ctx) {
    throw new Error("useSingleOrderContext must be used within SingleOrderProvider");
  }
  return ctx;
}
