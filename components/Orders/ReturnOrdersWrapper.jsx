'use client'
import React, { useMemo, useState } from 'react'
import greenRial from '@/public/images/greenRial.svg'
import orangerial from '@/public/images/orangerial.svg'
import Image from 'next/image'
import waIcon from '@/public/images/waIcon.svg'
import Link from 'next/link'
import SubPageHeader from '../home/SubPageHeader'
import { toast } from 'sonner'
import { axiosInstance } from '@/src/utils/axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Loader from '../home/loader'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Eye } from 'lucide-react'
import ReturnOrderActionsMenu from './return-order-actions-menu'
import ReturnRequestDialog from './return-request-dialog'
import RefundContractActionsMenu from '@/components/analysis/returned/refund-contract-actions-menu'
import {
    buildRefundsLookup,
    canManageAdminRefund,
    getOrderAdminApprovalStatus,
    isAdminRefundApproved,
    isReturnContractOrder,
    mapCreatedAtFilter,
    resolveRefundForOrder,
} from '@/components/analysis/returned/refund-contract-utils'

function CustomerRefundBadge({ refunded }) {
    if (refunded === true || refunded === 1) {
        return (
            <span className="px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap bg-[#E6FFE6] text-[#10B981]">
                ✅ تم المــوافقة
            </span>
        )
    }
    if (refunded === false || refunded === 0) {
        return (
            <span className="px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap bg-[#FFE6E6] text-[#EF4444]">
                ❌ لم تتم المــوافقة
            </span>
        )
    }
    return (
        <span className="px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap bg-[#FFF7E6] text-[#D97706]">
            ⏳ بانتظار الاسترجاع
        </span>
    )
}

function AdminApprovalCell({ row }) {
    if (!isReturnContractOrder(row)) {
        return <span className="text-[13px] text-[#A3A3A3]">—</span>
    }

    const approved = isAdminRefundApproved(getOrderAdminApprovalStatus(row))

    if (approved) {
        return (
            <span className="px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap bg-[#E6FFE6] text-[#10B981]">
                ✅ تم المــوافقة
            </span>
        )
    }

    return (
        <span className="px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap bg-[#FFE6E6] text-[#EF4444]">
            ❌ لم تتم المــوافقة
        </span>
    )
}

export default function ReturnOrdersWrapper({ searchParams }) {
    
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [resolvedParams, setResolvedParams] = useState(null)
    const [isResolved, setIsResolved] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()
    const [returnDialogOpen, setReturnDialogOpen] = useState(false)
    const [returnDialogOrder, setReturnDialogOrder] = useState(null)

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    React.useEffect(() => {
        if (!searchParams) {
            setIsResolved(true);
            return;
        }
        if (searchParams instanceof Promise) {
            searchParams.then(res => {
                setResolvedParams(res);
                setIsResolved(true);
            });
        } else {
            setResolvedParams(searchParams);
            setIsResolved(true);
        }
    }, [searchParams])

    const createdAtParam = resolvedParams?.created_at || null;

    React.useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery, createdAtParam]);

    const tableHeaders = [
        "رقــم الطلب",
        "رقــم جوال العميل",
        "نــوع العقــد",
        "الدفـــع",
        "المبــلغ المطالــب اســترجاعه",
        "تم الاستــرجــاع",
        "رافــع الطلب",
        "مــوافقة الادارة",
        "عرض العقــد",
    ];

    function getReturnOrders(page = 1) {
        let url = `/admin/orders/return?page=${page}`;
        if (createdAtParam) {
            const createAt = createdAtParam === 'total' ? 'all' : createdAtParam === 'day' ? 'today' : createdAtParam;
            url += `&created_at=${createAt}`;
        }
        if (debouncedSearchQuery) {
            url += `&search=${encodeURIComponent(debouncedSearchQuery)}`;
        }
        return axiosInstance.get(url)
            .then(res => res.data);
    }

    const createdAtFilter = mapCreatedAtFilter(
        createdAtParam === 'day' ? 'day' : createdAtParam || 'total'
    );

    const { data: responseData, isLoading, isError } = useQuery({
        queryKey: ['returnOrders', currentPage, createdAtParam, debouncedSearchQuery],
        queryFn: () => getReturnOrders(currentPage),
        enabled: isResolved,
    });

    const { data: refundsResponse } = useQuery({
        queryKey: ['refundContractsLookup', createdAtFilter],
        queryFn: () =>
            axiosInstance
                .get(
                    `/admin/analytics/refunds/contracts?created_at=${createdAtFilter}&page=1`
                )
                .then((res) => res.data),
        enabled: isResolved,
    });

    const rawData = responseData?.data;
    const items = rawData?.items ?? [];
    const pagination = rawData?.pagination;
    const returnOrdersQueryKey = ['returnOrders', currentPage, createdAtParam, debouncedSearchQuery];

    const refundsLookup = useMemo(() => {
        const payload = refundsResponse?.data;
        const refundItems = Array.isArray(payload) ? payload : (payload?.items ?? []);
        return buildRefundsLookup(refundItems);
    }, [refundsResponse]);

    const getPageTitle = () => {
        if (!createdAtParam) return "الطلبات المسترجعة";
        switch (createdAtParam) {
            case 'day':
                return "الطلبات المسترجعة / اليــوم";
            case 'week':
                return "الطلبات المسترجعة / الأسبوع";
            case 'month':
                return "الطلبات المسترجعة / الشهر";
            case 'year':
                return "الطلبات المسترجعة / السنة";
            case 'total':
                return "إجمالي الطلبات المسترجعة";
            default:
                return "الطلبات المسترجعة";
        }
    }

    const handleRefresh = () => {
        setSearchQuery('')
        setDebouncedSearchQuery('')
        setCurrentPage(1)
        queryClient.invalidateQueries({ queryKey: ['returnOrders'] })
        queryClient.invalidateQueries({ queryKey: ['refundContractsLookup'] })
    }

    if (isLoading || !isResolved) return <Loader />
    if (isError) return <div className="text-center p-8 text-[#FA5252] text-[15px]">حدث خطأ أثناء تحميل بيانات طلبات الاسترجاع</div>

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen" dir="rtl">
            <SubPageHeader
                title={getPageTitle()}
                isMain={false}
                first="الرئيــسية"
                firstURL="/"
                second="الطلبات المسترجعة"
                secondURL="/home/return-orders"
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onRefresh={handleRefresh}
            />

            <div className="w-full overflow-x-auto bg-white rounded-[24px] border border-[#E4E4E4] shadow-sm">
                <table className="w-full border-collapse">
                    <thead className="bg-[#FAFAFA]">
                        <tr>
                            {tableHeaders.map((header, index) => (
                                <th key={index} className="text-right p-[15px_20px] text-[#A3A3A3] text-[13px] font-medium border-b border-[#E4E4E4] whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((row) => {
                                const isHousing =
                                    row.contract_type_key === 'housing' ||
                                    row.contract_type === 'سكنـي' ||
                                    row.contract_type === 'سكني'
                                const refund = resolveRefundForOrder(row, refundsLookup)
                                const showAdminApproval =
                                    isReturnContractOrder(row) &&
                                    refund &&
                                    canManageAdminRefund(refund)
                                const customerRefunded =
                                    row.customer_refunded ??
                                    row.is_refunded ??
                                    row.refunded

                                return (
                                <tr
                                    key={row.id}
                                    className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#fafafa] transition-all"
                                >
                                    <td className="p-[15px_20px]">
                                        <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-[#f9f9f9] rounded-lg w-fit mx-auto border border-[#eee]">
                                            <span className="text-black text-[12px] font-bold">{row?.uuid}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(row?.uuid)
                                                    toast.success('تم نسخ رقم الطلب')
                                                }}
                                                className="text-[#A3A3A3] hover:text-brand-main"
                                            >
                                                <i className="fa-regular fa-copy text-[11px]"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-[15px_20px]">
                                        <div className="flex items-center gap-2">
                                            <span className="text-black text-[13px]" dir="ltr">
                                                {row?.user_mobile || '—'}
                                            </span>
                                            {row?.user_mobile ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(row.user_mobile)
                                                            toast.success('تم نسخ رقم الجوال')
                                                        }}
                                                        className="text-[#A3A3A3] hover:text-brand-main"
                                                    >
                                                        <i className="fa-regular fa-copy text-[11px]"></i>
                                                    </button>
                                                    <Link
                                                        href={`https://wa.me/${row.user_mobile}`}
                                                        target="_blank"
                                                        className="hover:scale-110 transition-all"
                                                    >
                                                        <Image src={waIcon} alt="wa" width={16} height={16} />
                                                    </Link>
                                                </>
                                            ) : null}
                                        </div>
                                    </td>
                                    <td className="p-[15px_20px]">
                                        <span className={`px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap ${isHousing ? 'bg-[#F0E6FF] text-[#7C3AED]' : 'bg-[#FFE6F0] text-[#EC4899]'}`}>
                                            {row?.contract_type}
                                        </span>
                                    </td>
                                    <td className="p-[15px_20px]">
                                        {row?.is_paid ? (
                                            <div className="flex items-center gap-1.5 text-[#007C13] font-bold text-[13px]">
                                                <span>{row?.amount_payment}</span>
                                                <Image src={greenRial} alt="rial" width={14} height={14} />
                                                <i className="fa-solid fa-circle-check text-[12px]"></i>
                                            </div>
                                        ) : (
                                            <span className="text-[13px] font-bold text-[#EF4444]">
                                                {row?.payment_label_ar || 'لم يتم الدفع'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-[15px_20px]">
                                        <div className="flex items-center gap-1.5 text-brand-main font-bold text-[13px]">
                                            <span>
                                                {row?.refund_amount != null && row?.refund_amount !== ''
                                                    ? row.refund_amount
                                                    : '—'}
                                            </span>
                                            {row?.refund_amount != null && row?.refund_amount !== '' ? (
                                                <Image src={orangerial} alt="rial" width={14} height={14} />
                                            ) : null}
                                        </div>
                                    </td>
                                    <td className="p-[15px_20px]">
                                        <CustomerRefundBadge refunded={customerRefunded} />
                                    </td>
                                    <td className="p-[15px_20px]">
                                        <span className="px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap bg-[#F0E6FF] text-[#7C3AED]">
                                            {row?.employee_name || row?.accept_retrun_contract_employee?.name || '—'}
                                        </span>
                                    </td>
                                    <td className="p-[15px_20px]">
                                        <AdminApprovalCell row={row} />
                                    </td>
                                    <td className="p-[15px_20px]">
                                        <div
                                            className="flex items-center gap-2"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {showAdminApproval ? (
                                                <RefundContractActionsMenu
                                                    refund={refund}
                                                    queryKey={returnOrdersQueryKey}
                                                />
                                            ) : null}
                                            {!isReturnContractOrder(row) ? (
                                                <ReturnOrderActionsMenu
                                                    order={row}
                                                    queryKey={returnOrdersQueryKey}
                                                    onReturnRequest={(order) => {
                                                        setReturnDialogOrder(order)
                                                        setReturnDialogOpen(true)
                                                    }}
                                                />
                                            ) : null}
                                            <button
                                                type="button"
                                                onClick={() => router.push(`/home/orders/${row.id}`)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F5F5F5] text-[#4D4D4D] hover:bg-brand-main hover:text-white transition-all"
                                                aria-label="عرض العقد"
                                            >
                                                <Eye className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={tableHeaders.length} className="text-center p-8 text-[#A3A3A3] text-sm">
                                    لا توجد طلبات مسترجعة متوفرة حالياً.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ReturnRequestDialog
                open={returnDialogOpen}
                onOpenChange={setReturnDialogOpen}
                order={returnDialogOrder}
                queryKey={returnOrdersQueryKey}
            />

            {/* pagination controls */}
            {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-center gap-2.5 mt-6" dir="rtl">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="w-9 h-9 rounded-full border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:bg-brand-main hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#A3A3A3]"
                    >
                        <ChevronRight className="size-4" />
                    </button>

                    {(() => {
                        const pages = [];
                        const { last_page } = pagination;
                        const range = 1;
                        const start = Math.max(1, currentPage - range);
                        const end = Math.min(last_page, currentPage + range);

                        if (start > 1) {
                            pages.push(1);
                            if (start > 2) pages.push('...');
                        }

                        for (let i = start; i <= end; i++) {
                            pages.push(i);
                        }

                        if (end < last_page) {
                            if (end < last_page - 1) pages.push('...');
                            pages.push(last_page);
                        }

                        return pages.map((page, idx) => {
                            if (page === '...') {
                                return (
                                    <span key={`dots-${idx}`} className="text-[#A3A3A3] px-1">
                                        ...
                                    </span>
                                );
                            }
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-medium transition-all ${currentPage === page
                                            ? "bg-brand-main text-white shadow-lg shadow-brand-main/20"
                                            : "border border-[#E4E4E4] text-[#A3A3A3] hover:bg-[#f5f5f5]"
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        });
                    })()}

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(pagination.last_page, prev + 1))}
                        disabled={currentPage === pagination.last_page}
                        className="w-9 h-9 rounded-full border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:bg-brand-main hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#A3A3A3]"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
