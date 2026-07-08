"use client";

import Link from "next/link";

function getCurrentContractId(orderData) {
  return orderData?.id ?? orderData?.contract_summary?.id ?? null;
}

const buttonBase =
  "inline-flex items-center justify-center min-w-[120px] px-5 py-3 rounded-xl text-sm font-bold border-2 transition-all shrink-0";

export default function UserRelatedContracts({ orderData }) {
  const contracts = Array.isArray(orderData?.user_contracts)
    ? orderData.user_contracts
    : [];
  const currentContractId = getCurrentContractId(orderData);

  if (!contracts.length) return null;

  return (
    <div className="pt-4 border-t border-[#E8E8E8]">
      <p className="text-[13px] font-bold text-[#4D4D4D] mb-3">عقود مرتبطة</p>
      <div className="flex items-center gap-3 flex-wrap">
        {contracts.map((contract) => {
          const contractId = contract?.id;
          const contractUuid = contract?.uuid || "—";
          const isActive =
            contractId != null &&
            currentContractId != null &&
            String(contractId) === String(currentContractId);

          return (
            <Link
              key={contractId ?? contractUuid}
              href={`/home/orders/${contractId}`}
              className={`${buttonBase} ${
                isActive
                  ? "bg-primary text-white border-primary pointer-events-none"
                  : "bg-white border-[#E4E4E4] text-black hover:border-primary hover:text-primary"
              }`}
              dir="ltr"
            >
              {contractUuid}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
