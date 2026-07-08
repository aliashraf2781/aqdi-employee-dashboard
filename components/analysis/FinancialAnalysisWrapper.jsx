'use client'
import React, { useEffect, useState } from 'react'
import Header from '../home/Header'
import greenRial from '@/public/images/greenRial.svg'
import Image from 'next/image'
import waIcon from '@/public/images/waIcon.svg'
import blueRial from '@/public/images/blueRial.svg'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/src/utils/axios'

export default function FinancialAnalysisWrapper({ id }) {
    const [title, setTitle] = useState('')

    useEffect(() => {
        switch (id) {
            case 'day':
                setTitle('دخل اليــوم')
                break;
            case 'week':
                setTitle('دخل الأسبوع')
                break;
            case 'month':
                setTitle('دخل الشهر')
                break;
            case 'year':
                setTitle('دخل العام')
                break;
            case 'total':
                setTitle('إجمالي الدخــل')
                break;
            default:
                setTitle('دخل اليــوم')
                break;
        }
    }, [id])

    const doneImojy = "✅"

    const tableHeaders = [
        "رقــم الجوال",
        "المبلغ",
        "الســاعة",
        "تاريخ الدفع",
        "رقم العقد",
        "العملة",
        "طريقة الدفع",
        "الحالة",
    ];

    const statusLabels = {
        success: "ناجحة",
        pending: "قيد الانتظار",
        failed: "فشلت",
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['payment', id],
        queryFn: async () => {
            const createAt = id == "total" ? "all" : id
            const res = await axiosInstance.get(`/admin/payments?created_at=${createAt}`)
            return res.data.data
        }
    })
    console.log(data)

    const paymentsList = Array.isArray(data) ? data : (data?.data || []);

    const tableData = paymentsList.map((item) => {
        return {
            id: item.id,
            phone: item.user_mobile || '',
            amount: item.amount,
            time: item.payment_hour,
            date: item.payment_date,
            contractNumber: item.contract_uuid,
            currency: item.tran_currency,
            paymentMethod: item.payment_method,
            status: item.status,
        }
    })

    const renderTableBody = () => {
        if (isLoading) {
            return Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="border-b border-[#F5F5F5] last:border-0 animate-pulse">
                    <td className="p-[15px_20px]">
                        <div className="h-4 bg-[#E4E4E4] rounded w-28 animate-pulse"></div>
                    </td>
                    <td className="p-[15px_20px]">
                        <div className="h-4 bg-[#E4E4E4] rounded w-16 animate-pulse"></div>
                    </td>
                    <td className="p-[15px_20px]">
                        <div className="h-4 bg-[#E4E4E4] rounded w-12 animate-pulse"></div>
                    </td>
                    <td className="p-[15px_20px]">
                        <div className="h-4 bg-[#E4E4E4] rounded w-24 animate-pulse"></div>
                    </td>
                    <td className="p-[15px_20px]">
                        <div className="h-4 bg-[#E4E4E4] rounded w-16 animate-pulse"></div>
                    </td>
                    <td className="p-[15px_20px]">
                        <div className="h-4 bg-[#E4E4E4] rounded w-8 animate-pulse"></div>
                    </td>
                    <td className="p-[15px_20px]">
                        <div className="h-4 bg-[#E4E4E4] rounded w-14 animate-pulse"></div>
                    </td>
                    <td className="p-[15px_20px]">
                        <div className="h-6 bg-[#E4E4E4] rounded-full w-16 animate-pulse"></div>
                    </td>
                </tr>
            ));
        }

        if (isError) {
            return (
                <tr>
                    <td colSpan={tableHeaders.length} className="text-center p-8 text-[#FA5252] text-[15px] font-medium">
                        حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.
                    </td>
                </tr>
            );
        }

        if (tableData.length === 0) {
            return (
                <tr>
                    <td colSpan={tableHeaders.length} className="text-center p-8 text-[#A3A3A3] text-[15px]">
                        لا توجد مدفوعات متوفرة حالياً
                    </td>
                </tr>
            );
        }

        return tableData.map((row) => (
            <tr key={row.id} className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#fafafa] transition-all">
                <td className="p-[15px_20px]">
                    <div className="flex items-center gap-2.5">
                        <span className="text-black text-[13px] font-normal">{row.phone || "—"}</span>
                        {row.phone && (
                            <>
                                <button onClick={() => navigator.clipboard.writeText(row.phone)} className="text-[#A3A3A3] hover:text-brand-main transition-all" title="نسخ رقم الجوال">
                                    <i className="fa-regular fa-copy text-[12px]"></i>
                                </button>
                                <Link href={`https://wa.me/${row.phone}`} target="_blank" className="hover:scale-110 transition-all" title="محادثة واتساب">
                                    <Image src={waIcon} alt="wa" width={16} height={16} />
                                </Link>
                            </>
                        )}
                    </div>
                </td>
                <td className="p-[15px_20px]">
                    <div className="flex items-center gap-1.5">
                        <span className="text-black text-[13px] font-semibold">{row.amount}</span>
                        <Image src={greenRial} alt="rial" width={16} height={16} />
                    </div>
                </td>
                <td className="p-[15px_20px] text-black text-[13px]">{row.time}</td>
                <td className="p-[15px_20px] text-[#616161] text-[13px] whitespace-nowrap">{row.date}</td>
                <td className="p-[15px_20px] text-black text-[13px]">{row.contractNumber}</td>
                <td className="p-[15px_20px]">
                    <Image src={(row.currency === "ريال" || row.currency === "SAR") ? blueRial : greenRial} alt="rial" width={16} height={16} />
                </td>
                <td className="p-[15px_20px] text-[#616161] text-[13px]">{row.paymentMethod}</td>
                <td className="p-[15px_20px]">
                    <span className="px-3 py-1 bg-[#F5F5F5] text-[#616161] rounded-full text-[11px] font-medium whitespace-nowrap">
                        {statusLabels[row.status] || row.status || "غير معروف"}
                    </span>
                </td>
            </tr>
        ));
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen" dir="rtl">
            <Header
                page='welcome'
                title={title}
                isMain={false}
                first="الرئيــسية"
                firstURL="/"
                second='التحليــلات'
                secondURL="/home/analysis"
                third={title}
                thirdURL={`/home/financial-analysis/${id}`}
            />
            <div className="w-full overflow-x-auto bg-white rounded-[24px] border border-[#E4E4E4] mt-4">
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
                        {renderTableBody()}
                    </tbody>
                </table>
            </div>
{/* 
            <div className="flex items-center justify-center gap-2.5 mt-4">
                <button className="w-9 h-9 rounded-full border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:bg-brand-main hover:text-white transition-all">
                    <i className="fa-solid fa-chevron-right text-[12px]"></i>
                </button>
                <button className="w-9 h-9 rounded-full bg-brand-main text-white flex items-center justify-center text-[13px] font-medium shadow-lg shadow-brand-main/20">1</button>
                <button className="w-9 h-9 rounded-full border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:bg-[#f5f5f5] transition-all text-[13px]">2</button>
                <span className="text-[#A3A3A3]">...</span>
                <button className="w-9 h-9 rounded-full border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:bg-[#f5f5f5] transition-all text-[13px]">40</button>
                <button className="w-9 h-9 rounded-full border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:bg-brand-main hover:text-white transition-all">
                    <i className="fa-solid fa-chevron-left text-[12px]"></i>
                </button>
            </div> */}
        </div>
    );
}