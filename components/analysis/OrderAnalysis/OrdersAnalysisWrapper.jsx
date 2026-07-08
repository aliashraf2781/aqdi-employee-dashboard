'use client'
import React, { useEffect, useState } from 'react'
import SubPageHeader from '../../home/SubPageHeader'
import { useQueryClient } from '@tanstack/react-query'
import greenRial from '@/public/images/greenRial.svg'
import Image from 'next/image'
import waIcon from '@/public/images/waIcon.svg'
import blueRial from '@/public/images/blueRial.svg'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/src/utils/axios'
import Loader from '@/components/home/loader'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Copy } from 'lucide-react'

export default function OrdersAnalysisWrapper({ id }) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [title, setTitle] = useState('')
    const [refundModalStep, setRefundModalStep] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const filterOrders = (rows, query) => {
        if (!query.trim()) return rows;
        const normalizedQuery = query.toLowerCase().trim();
        return rows.filter((row) =>
            Object.values(row).some((value) =>
                value != null && String(value).toLowerCase().includes(normalizedQuery)
            ) ||
            (row.is_documented === true && 'نعم'.includes(normalizedQuery)) ||
            (row.is_documented === false && 'لا'.includes(normalizedQuery))
        );
    };
    // useEffect(() => {
    //     switch (id) {
    //         case 'day':
    //             setTitle('طلبات اليــوم المكتمله')
    //             break;
    //         case 'week':
    //             setTitle('طلبات الأسبوع المكتمله')
    //             break;
    //         case 'month':
    //             setTitle('طلبات الشهر المكتمله')
    //             break;
    //         case 'year':
    //             setTitle('طلبات السنة المكتمله')
    //             break;
    //         case 'total':
    //             setTitle('إجمالي الطلبات المكتمله')
    //             break;
    //         case 'completed_orders':
    //             setTitle('الطلبات المكتملة')
    //             break;
    //         case 'incompleted_orders':
    //             setTitle('الطلبات غير المكتملة')
    //             break;
    //         case 'whatsapp_completed_orders':
    //             setTitle("طلبات واتساب مكتملة")
    //             break;
    //         case 'whatsapp_incompleted_orders':
    //             setTitle("طلبات واتساب غير مكتملة")
    //             break;
    //         case 'refunded_orders':
    //             setTitle("طلبات مسترجعه")
    //             break;
    //         //تم التوثيـــق
    //         case 'verified':
    //             setTitle("تم التوثيـــق")
    //             break;
    //         default:
    //             setTitle('طلبات اليــوم المكتمله')
    //             break;
    //     }
    // }, [id])

    const tableHeaders = [
        "رقــم جوال العميل",
        "قيمة المبلغ",
        "نــوع العقــد",
        // "التصنيف",
        "هل تم توثيق العقد",
        "مدة العقد ",
        "الاجـــراءات",

    ];

    const tableData = [
        {
            id: 1,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "صك إلكــتروني",
            status: "قيد المعـالجة ..",
            payment: "99.99",
            reciveDate: "منذ 10د",
            reciver: "ريـــان"
        },
        {
            id: 2,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "تجــاري",
            documentType: "صك ورقي",
            status: "وثيقة عقارية غير القياسية",
            payment: "99.99",
            reciveDate: "منذ 10د",
            reciver: "ريـــان"
        },
        {
            id: 3,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "وثيقة",
            status: "محتوى دفع من العميل",
            payment: "99.99",
            reciveDate: "منذ 10د",
            reciver: "ريـــان"
        },
        {
            id: 4,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "تجــاري",
            documentType: "صك ورقي",
            status: "تم تأكيد العقار",
            payment: "99.99",
            reciveDate: "منذ 10د",
            reciver: "ريـــان"
        },
        {
            id: 5,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "صك ورقي",
            status: "وثيقة عقارية غير القياسية",
            payment: "99.99",
            reciveDate: "منذ 10د",
            reciver: "ريـــان"
        },
        {
            id: 6,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "تجــاري",
            documentType: "وثيقة عقارية",
            status: "محتوى دفع من العميل",
            payment: "99.99",
            reciveDate: "منذ 10د",
            reciver: "ريـــان"
        },
        {
            id: 7,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "الاستلام",
            status: "واثيقة عقارية غير القياسية",
            payment: "99.99",
            reciveDate: "منذ 10د",
            reciver: "ريـــان"
        },
        {
            id: 8,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "تجــاري",
            documentType: "تم تأكيد الطلب",
            status: "حجز استلام",
            payment: "99.99",
            reciveDate: "منذ 10د",
            reciver: "ريـــان"
        },
        {
            id: 9,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "تم تأكيد الطلب",
            status: "عقد إيجار من العميل",
            payment: "99.99",
            reciveDate: "منذ 10د",
            reciver: "ريـــان"
        },
        {
            id: 10,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "الاستلام",
            status: "واثيقة عقارية غير القياسية",
            payment: "99.99",
            reciveDate: "منذ 10د",
            reciver: "ريـــان"
        },
        {
            id: 11,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "طلب واستلام تعديل",
            status: "محتوى دفع من العميل",
            payment: "99.99",
            reciveDate: "منذ 10د",
            reciver: "ريـــان"
        },
        {
            id: 12,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "محتوى دفع من العميل",
            status: "عقد إيجار من العميل",
            payment: "99.99",
            reciveDate: "منذ 10د",
            reciver: "ريـــان"
        }
    ];

    const getDocumentTypeClass = (type) => {
        const typeMap = {
            'صك إلكــتروني': 'bg-[#E6F7FF] text-[#0EA5E9]',
            'عقد إيجار': 'bg-[#FFF4E6] text-[#F59E0B]',
            'صك ورقي': 'bg-[#FFE6E6] text-[#EF4444]',
            'وثيقة عقارية': 'bg-[#E6FFE6] text-[#10B981]',
            'طلب واستلام تعديل': 'bg-[#FFF0E6] text-[#F97316]',
            'تم تأكيد العقار': 'bg-[#FFF0E6] text-[#F97316]',
            'الاستلام': 'bg-[#E6F2FF] text-[#3B82F6]',
            'تم تأكيد الطلب': 'bg-[#E6F2FF] text-[#3B82F6]',
            'عقد إيجار من العميل': 'bg-[#FFE6F5] text-[#EC4899]',
            'محتوى دفع من العميل': 'bg-[#FFE6F5] text-[#EC4899]'
        };
        return typeMap[type] || 'bg-[#F5F5F5] text-[#A3A3A3]';
    };

    const getStatusClass = (status) => {
        const statusMap = {
            'قيد المعـالجة ..': 'bg-[#E6F7FF] text-[#0EA5E9]',
            'تم تأكيد العقار': 'bg-[#E6FFE6] text-[#10B981]',
            'جديد استلام': 'bg-[#FFE6F5] text-[#EC4899]',
            'حجز استلام': 'bg-[#FFF4E6] text-[#F59E0B]',
            'عقد إيجار من العميل': 'bg-[#F3E6FF] text-[#A855F7]',
            'واثيقة عقارية غير القياسية': 'bg-[#FEF3E6] text-[#F59E0B]'
        };
        return statusMap[status] || 'bg-[#F5F5F5] text-[#A3A3A3]';
    };

    function getWhatsOrder() {
        return axiosInstance(`/admin/contract-whatsapp?is_complete=1&page=${currentPage}`)
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['orders-whatsapp-completed', currentPage],
        queryFn: () => getWhatsOrder(),
    })

    const paginatedData = data?.data?.data;
    const orders = paginatedData?.data ?? [];
    const filteredOrders = filterOrders(orders, searchQuery);
    const pagination = paginatedData;
    const showPagination = pagination && pagination.last_page > 1 && !searchQuery.trim();



    if (isLoading) {
        return <Loader />
    }

    const handleRefresh = () => {
        setSearchQuery('')
        setCurrentPage(1)
        queryClient.invalidateQueries({ queryKey: ['orders-whatsapp-completed'] })
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen" dir="rtl">
            <SubPageHeader
                title="طلبات واتساب مكتملة"
                isMain={false}
                first="الرئيــسية"
                firstURL="/"
                second="التحليــلات"
                secondURL="/home/analysis"
                third="طلبات واتساب مكتملة"
                thirdURL="/home/completed-whatsapp"
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onRefresh={handleRefresh}
            />

            <div className="w-full overflow-x-auto bg-white rounded-[24px] border border-[#E4E4E4]">
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
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((row) => (
                            <tr key={row.id} className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#fafafa] transition-all">
                                <td className="p-[15px_20px]">
                                    <div className="flex items-center gap-2">
                                        <span className="text-black text-[13px]">{row.mobile_number}</span>
                                        <Copy size={10} className="cursor-pointer" onClick={() => {
                                            navigator.clipboard.writeText(row.mobile_number)
                                            toast.success("تم نسخ الرقم")
                                        }} />
                                        <Link href={`https://wa.me/${row.mobile_number}`} target="_blank" className="hover:scale-110 transition-all">
                                            <Image src={waIcon} alt="wa" width={16} height={16} />
                                        </Link>
                                    </div>
                                </td>
                                <td className="p-[15px_20px]">
                                    <div className="flex items-center gap-1.5 text-[#007C13] font-bold text-[13px]">
                                        <span>{row.amount_paid_by_client}</span>
                                        <Image src={greenRial} alt="rial" width={14} height={14} />
                                        <i className="fa-solid fa-circle-check text-[12px]"></i>
                                    </div>
                                </td>
                                <td className="p-[15px_20px]">
                                    <span className={`px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap ${row.contractType === 'سكنـي' ? 'bg-[#F0E6FF] text-[#7C3AED]' : 'bg-[#FFE6F0] text-[#EC4899]'}`}>
                                        {row.contract_type}
                                    </span>
                                </td>
                                {/* <td className="p-[15px_20px]">
                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${getDocumentTypeClass(row.documentType)}`}>
                                        {"hhhhh"}
                                    </span>
                                </td> */}
                                <td className="p-[15px_20px]">
                                    {row?.is_documented == null ? "--" : row.is_documented ? "نعم" : "لا"}
                                </td>
                                <td className="p-[15px_20px] text-[#616161] text-[13px]">{row?.contract_duration || "--"}</td>
                                <td className="p-[15px_20px]">
                                    <button onClick={() => { router.push(`/home/orders/${row.id}`) }} className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F5F5F5] text-[#4D4D4D] hover:bg-brand-main hover:text-white transition-all mx-auto">
                                        👁️
                                    </button>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={tableHeaders.length} className="text-center p-8 text-[#A3A3A3] text-sm">
                                    لا توجد نتائج مطابقة للبحث.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showPagination && (
                <div className="flex items-center justify-center gap-2.5 mt-4" dir="rtl">
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