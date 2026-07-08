'use client'
import React, { useEffect, useState } from 'react'
import StaffCard from './StaffCard'
import defaultUser from '@/public/images/defaultUser.jpg'
import Header from '../home/Header'
import { axiosInstance } from '@/src/utils/axios'
import { useQuery } from '@tanstack/react-query'
import Loader from '../home/loader'

export default function StaffAnalysisWrapper({ id }) {
    const [title, setTitle] = useState('')

    useEffect(() => {
        switch (id) {
            case 'most_received_orders':
                setTitle('أكثر الموظفين استلم طلب')
                break;
            case 'most_completed_orders':
                setTitle('أكثر الموظفين وثق طلب')
                break;
            case 'most_incompleted_orders':
                setTitle("أكثر موظف اكتسب طلب غير مدفوع")
                break;
            case 'most_refunded_orders':
                setTitle("أكثر موظف قدم استرجاع")
                break;
            case 'total':
                setTitle("عدد الموظفين")
                break;
            default:
                setTitle("عدد الموظفين")
                break;
        }
    }, [id])

    const getEmployeeAnalytics = () => {
        let endpoint = `/admin/analytics/employees/most-received-orders`;
        if (id === 'most_completed_orders') {
            endpoint = `/admin/analytics/employees/most-documented-orders`;
        } else if (id === 'most_incompleted_orders') {
            endpoint = `/admin/analytics/employees/most-unpaid-orders`;
        } else if (id === 'most_refunded_orders') {
            endpoint = `/admin/analytics/employees/most-returns`;
        }
        return axiosInstance.get(endpoint).then(res => res.data);
    }

    const { data: responseData, isLoading, isError } = useQuery({
        queryKey: ['employeeAnalytics', id],
        queryFn: getEmployeeAnalytics,
    });

    const rawData = responseData?.data;
    const staffList = rawData?.employees || [];
    const staffData = staffList.map(emp => ({
        id: emp.id,
        rank: emp.rank,
        image: emp.profile_image || defaultUser,
        name: emp.name,
        role: emp.role_title || emp.role || "موظف",
        count: emp.metric_count ?? emp.count ?? 0,
        label: emp.metric_label_ar || rawData?.metric_label_ar || "عدد العمليات"
    }));

    if (isLoading) return <Loader />
    if (isError) return <div className="text-center p-8 text-[#FA5252] text-[15px]">حدث خطأ أثناء تحميل البيانات</div>

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen" dir="rtl">
            <Header page='welcome' title={title} isMain={false} first="الرئيــسية" firstURL="/" second='التحليــلات' secondURL="/home/analysis" third={title} thirdURL={`/home/staff-analysis/${id}`} />
            
            <div className="mt-6">
                {staffData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {staffData.map((staff) => (
                            <StaffCard key={staff.id} staff={staff} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-12 bg-white rounded-[24px] border border-[#E4E4E4] text-[#A3A3A3] text-[14px]">
                        لا توجد بيانات موظفين متوفرة حالياً لهذه الفئة.
                    </div>
                )}
            </div>
        </div>
    );
}