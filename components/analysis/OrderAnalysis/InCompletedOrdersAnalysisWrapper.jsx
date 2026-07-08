'use client'
import React, { useEffect, useState } from 'react'
import SubPageHeader from '../../home/SubPageHeader'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import greenRial from '@/public/images/greenRial.svg'
import Image from 'next/image'
import waIcon from '@/public/images/waIcon.svg'
import blueRial from '@/public/images/blueRial.svg'
import Link from 'next/link'
import Loader from '@/components/home/loader'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/src/utils/axios'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function OrdersAnalysisWrapper({ id }) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [title, setTitle] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [id, debouncedSearchQuery]);

    useEffect(() => {
        switch (id) {
            case 'day':
                setTitle('طلبات اليــوم الغيــر المكتمله')
                break;
            case 'week':
                setTitle('طلبات الأسبوع الغيــر المكتمله')
                break;
            case 'month':
                setTitle('طلبات الشهر الغيــر المكتمله')
                break;
            case 'year':
                setTitle('طلبات السنة الغيــر المكتمله')
                break;
            case 'total':
                setTitle('إجمالي الطلبات الغيــر المكتمله')
                break;
            default:
                setTitle('الطلبات الغيــر المكتملة')
                break;
        }
    }, [id])

    const doneImojy = "✅"

    const tableHeaders = [
        "رقــم الطلب",
        "رقــم جوال العميل",
        "نــوع العقــد",
        "نـوع الوثيقة",
        "الدفـــع",
        "مستلم منذ",
        "حــالة الطلب",
        "الاسـتلام",
        "الاجـــراءات",

    ];

    const tableData = [
        {
            id: 1,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "صك إلكــتروني",
            status: "لم يتم التحديــد",
            payment: "❌",
            reciveDate: "منذ 10د",
            reciver: "لم يتم الاستــلام"
        },
        {
            id: 2,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "تجــاري",
            documentType: "صك ورقي",
            status: "لم يتم التحديــد",
            payment: "❌",
            reciveDate: "منذ 10د",
            reciver: "لم يتم الاستــلام"
        },
        {
            id: 3,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "وثيقة",
            status: "لم يتم التحديــد",
            payment: "❌",
            reciveDate: "منذ 10د",
            reciver: "لم يتم الاستــلام"
        },
        {
            id: 4,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "تجــاري",
            documentType: "صك ورقي",
            status: "لم يتم التحديــد",
            payment: "❌",
            reciveDate: "منذ 10د",
            reciver: "لم يتم الاستــلام"
        },
        {
            id: 5,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "صك ورقي",
            status: "لم يتم التحديــد",
            payment: "❌",
            reciveDate: "منذ 10د",
            reciver: "لم يتم الاستــلام"
        },
        {
            id: 6,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "تجــاري",
            documentType: "وثيقة عقارية",
            status: "لم يتم التحديــد",
            payment: "❌",
            reciveDate: "منذ 10د",
            reciver: "لم يتم الاستــلام"
        },
        {
            id: 7,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "الاستلام",
            status: "لم يتم التحديــد",
            payment: "❌",
            reciveDate: "منذ 10د",
            reciver: "لم يتم الاستــلام"
        },
        {
            id: 8,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "تجــاري",
            documentType: "تم تأكيد الطلب",
            status: "لم يتم التحديــد",
            payment: "❌",
            reciveDate: "منذ 10د",
            reciver: "لم يتم الاستــلام"
        },
        {
            id: 9,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "تم تأكيد الطلب",
            status: "لم يتم التحديــد",
            payment: "❌",
            reciveDate: "منذ 10د",
            reciver: "لم يتم الاستــلام"
        },
        {
            id: 10,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "الاستلام",
            status: "لم يتم التحديــد",
            payment: "❌",
            reciveDate: "منذ 10د",
            reciver: "لم يتم الاستــلام"
        },
        {
            id: 11,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "طلب واستلام تعديل",
            status: "لم يتم التحديــد",
            payment: "❌",
            reciveDate: "منذ 10د",
            reciver: "لم يتم الاستــلام"
        },
        {
            id: 12,
            orderNumber: "000001",
            phone: "997500013",
            contractType: "سكنـي",
            documentType: "محتوى دفع من العميل",
            status: "لم يتم التحديــد",
            payment: "❌",
            reciveDate: "منذ 10د",
            reciver: "لم يتم الاستــلام"
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
            'واثيقة عقارية غير القياسية': 'bg-[#FEF3E6] text-[#F59E0B]',
            'لم يتم التحديــد': 'bg-[#F5F5F5] text-[#A3A3A3]'
        };
        return statusMap[status] || 'bg-[#F5F5F5] text-[#A3A3A3]';
    };

    function getInCompletedOrders() {
        const createAt = id === 'total' ? 'all' : id;
        let url = `/admin/orders/incomplete/list?created_at=${createAt}&page=${currentPage}`;
        if (debouncedSearchQuery) {
            url += `&search=${encodeURIComponent(debouncedSearchQuery)}`;
        }
        return axiosInstance(url)
    }
    const { data, isLoading } = useQuery({
        queryKey: ["inCompletedOrders", id, debouncedSearchQuery, currentPage],
        queryFn: getInCompletedOrders
    })
    const orders = data?.data?.data?.items ?? []
    const pagination = data?.data?.data?.pagination


    const handleRefresh = () => {
        setSearchQuery('')
        setDebouncedSearchQuery('')
        setCurrentPage(1)
        queryClient.invalidateQueries({ queryKey: ['inCompletedOrders'] })
    }

    if (isLoading) return <Loader />


    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen" dir="rtl">
            <SubPageHeader
                title={title}
                isMain={false}
                first="الرئيــسية"
                firstURL="/"
                second="التحليــلات"
                secondURL="/home/analysis"
                third={title}
                thirdURL={`/home/incolpleted-orders-analysis/${id}`}
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
                        {orders?.map((row) => (
                            <tr key={row.id} className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#fafafa] transition-all">
                                <td className="p-[15px_20px]">
                                    <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-[#f9f9f9] rounded-lg w-fit mx-auto border border-[#eee]">
                                        <span className="text-black text-[12px] font-bold">{row?.uuid}</span>
                                        <button onClick={() => {
                                            navigator.clipboard.writeText(row?.uuid)
                                            toast.success('تم نسخ رقم الطلب')
                                        }} className="text-[#A3A3A3] hover:text-brand-main">
                                            <i className="fa-regular fa-copy text-[11px]"></i>
                                        </button>
                                    </div>
                                </td>
                                <td className="p-[15px_20px]">
                                    <div className="flex items-center gap-2">
                                        <span className="text-black text-[13px]">{row?.user_mobile}</span>
                                        <button onClick={() => {
                                            navigator.clipboard.writeText(row?.user_mobile)
                                            toast.success('تم نسخ رقم الجوال')
                                        }} className="text-[#A3A3A3] hover:text-brand-main">
                                            <i className="fa-regular fa-copy text-[11px]"></i>
                                        </button>
                                        <Link href={`https://wa.me/${row?.user_mobile}`} target="_blank" className="hover:scale-110 transition-all">
                                            <Image src={waIcon} alt="wa" width={16} height={16} />
                                        </Link>
                                    </div>
                                </td>
                                <td className="p-[15px_20px]">
                                    <span className={`px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap ${row.contractType === 'سكنـي' ? 'bg-[#F0E6FF] text-[#7C3AED]' : row.contractType === 'تجــاري' ? 'bg-[#FFE6F0] text-[#EC4899]' : 'bg-[#E6F0FF] text-[#3B82F6]'}`}>
                                        {row?.contract_type}
                                    </span>
                                </td>
                                <td className="p-[15px_20px]">
                                    <span className="px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap bg-[#F9F9F9] border border-[#eee] text-[#4D4D4D]">
                                        {row?.instrument_type ?? "---"}
                                    </span>
                                </td>
                                <td className="p-[15px_20px]">
                                    <div className="flex items-center gap-1.5 text-[#007C13] font-bold text-[13px]">
                                        <span>{row?.amount_payment}</span>
                                        <Image src={greenRial} alt="rial" width={14} height={14} />
                                        <i className="fa-solid fa-circle-check text-[12px]"></i>
                                    </div>
                                </td>
                                <td className="p-[15px_20px] text-[13px] text-[#A3A3A3] whitespace-nowrap">{new Date(row?.updated_at).toLocaleDateString('ar-EG')}</td>
                                <td className="p-[15px_20px]">
                                    <span className="px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap" style={{ backgroundColor: row?.status?.color || "#FFFBE6" }}>
                                        {row?.status?.name ? row?.status?.name : "قيد المعالجه"}
                                    </span>
                                </td>
                                <td className="p-[15px_20px]">
                                    <span className="text-[13px] text-[#4D4D4D] font-medium">{row?.employee_name}</span>
                                </td>
                                <td className="p-[15px_20px]">

                                    <button onClick={() => { router.push(`/home/orders/${row.id}`) }} className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F5F5F5] text-[#4D4D4D] hover:bg-brand-main hover:text-white transition-all mx-auto">
                                        👁️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.last_page > 1 && (
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