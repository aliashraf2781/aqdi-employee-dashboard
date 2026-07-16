"use client";

import React, { useState } from 'react';
import Header from '@/components/home/Header';
import { toast } from 'sonner';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from 'next/link';
import Loader from '@/components/home/loader';
import { axiosInstance } from '@/src/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import PermissionGate from '@/components/auth/PermissionGate';
import { PERMISSION_SECTIONS } from '@/src/lib/permissions';

export default function Roles() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const queryClient = useQueryClient();

    // Fetch Roles
    function getRoles(page = 1) {
        return axiosInstance.get(`/admin/roles?page=${page}`)
            .then((res) => res?.data)
            .catch((err) => {
                throw err;
            });
    }

    const { data, isLoading } = useQuery({
        queryKey: ['roles', currentPage],
        queryFn: () => getRoles(currentPage)
    });

    const roles = data?.data?.items || data?.items || [];
    const pagination = data?.data?.pagination || data?.pagination;

    // Delete Mutation
    const { mutate: deleteRole, isPending: deleteRolePending } = useMutation({
        mutationFn: (id) => axiosInstance.post(`/admin/roles/${id}/delete`),
        onSuccess: (res) => {
            toast.success(res?.data?.message || "تم حذف الدور بنجاح");
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            queryClient.invalidateQueries({ queryKey: ['roles-list'] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "حدث خطأ أثناء حذف الدور");
        }
    });

    const handleDelete = (role) => {
        setCategoryToDelete(role);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            deleteRole(categoryToDelete.id);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "---";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    // Harmonized badge & circular container color schemes
    const badgeColors = [
        { bg: '#000000', text: '#FFFFFF', pill: 'bg-black text-white' },
        { bg: '#E91E8C', text: '#FFFFFF', pill: 'bg-[#FFE5F3] text-[#E91E8C]' },
        { bg: '#10B981', text: '#FFFFFF', pill: 'bg-[#D1FAE5] text-[#10B981]' },
        { bg: '#6366F1', text: '#FFFFFF', pill: 'bg-[#E0E7FF] text-[#6366F1]' },
        { bg: '#F59E0B', text: '#FFFFFF', pill: 'bg-[#FEF3C7] text-[#D97706]' }
    ];

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen" dir="rtl">
            <Header
                page='welcome'
                title={"الادوار"}
                isMain={false}
                first="الرئيــسية"
                firstURL="/"
                second="الادوار"
                secondURL="/home/roles"
            />

            <div className="flex flex-col gap-6 bg-white rounded-[32px] border border-[#F0F0F0] p-8 mt-4 shadow-sm relative z-10">
                <div className="flex items-center justify-between pb-6 border-b border-[#F5F5F5]">
                    <h2 className="text-[20px] font-black text-black">إدارة الأدوار</h2>
                    <PermissionGate section={PERMISSION_SECTIONS.roles} action="create">
                        <Link href="/home/roles/add" className="flex items-center gap-2 px-6 py-3 bg-brand-main text-white rounded-full font-bold text-[14px] hover:bg-brand-main/90 transition-all shadow-lg shadow-brand-main/20">
                            <span>+ إضافة دور جديد</span>
                        </Link>
                    </PermissionGate>
                </div>

                <div className="w-full overflow-x-auto bg-white rounded-[24px] border border-[#E4E4E4] shadow-inner mt-4">
                    <table className="w-full border-collapse">
                        <thead className="bg-[#FAFAFA]">
                            <tr>
                                <th className="text-right p-4 text-[#A3A3A3] text-[13px] font-bold border-b border-[#E4E4E4] whitespace-nowrap">اللقــب</th>
                                <th className="text-right p-4 text-[#A3A3A3] text-[13px] font-bold border-b border-[#E4E4E4] whitespace-nowrap">الموظفون المشتركون</th>
                                <th className="text-center p-4 text-[#A3A3A3] text-[13px] font-bold border-b border-[#E4E4E4] whitespace-nowrap">عدد الصلاحيات</th>
                                <th className="text-right p-4 text-[#A3A3A3] text-[13px] font-bold border-b border-[#E4E4E4] whitespace-nowrap">تاريخ التحديث</th>
                                <th className="text-center p-4 text-[#A3A3A3] text-[13px] font-bold border-b border-[#E4E4E4] whitespace-nowrap">الاجـــراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.length > 0 ? (
                                roles.map((role, index) => {
                                    const colorScheme = badgeColors[index % badgeColors.length];
                                    const employeeNames = role.employees && role.employees.length > 0
                                        ? role.employees.map(emp => emp.name).join('، ')
                                        : 'لا يوجد موظفين مسجلين';

                                    return (
                                        <tr key={role.id} className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#fafafa] transition-all">
                                            <td className="p-4">
                                                <span
                                                    className="px-4 py-1.5 rounded-full text-white font-bold text-[12px] shadow-sm whitespace-nowrap"
                                                    style={{ backgroundColor: colorScheme.bg }}
                                                >
                                                    {role.title_trans || role.title_ar || role.name}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                                                        <i className="fa-solid fa-user-tie text-[#737373]"></i>
                                                    </div>
                                                    <span className="text-[14px] font-medium text-[#4D4D4D] line-clamp-1">
                                                        {employeeNames}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center">
                                                    <span
                                                        className="w-12 h-12 flex items-center justify-center rounded-full font-black text-[16px] shadow-inner border border-gray-100"
                                                        style={{
                                                            backgroundColor: colorScheme.bg + '15', // subtle 8% opacity tint
                                                            color: colorScheme.bg
                                                        }}
                                                    >
                                                        {role.permissions_count || 0}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-[13px] text-[#A3A3A3] font-medium">
                                                    {role.created_at_label || formatDate(role.updated_at)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-3">
                                                    <PermissionGate section={PERMISSION_SECTIONS.roles} action="edit">
                                                        <Link
                                                            href={`/home/roles/edit?id=${role.id}`}
                                                            className="w-10 h-10 rounded-full bg-[#E6FFE6] text-[#10B981] flex justify-center items-center hover:bg-[#10B981] hover:text-white transition-all shadow-sm"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square text-[14px]"></i>
                                                        </Link>
                                                    </PermissionGate>
                                                    <PermissionGate section={PERMISSION_SECTIONS.roles} action="delete">
                                                        <button
                                                            onClick={() => handleDelete(role)}
                                                            className="w-10 h-10 rounded-full bg-[#FFEBEB] text-[#FF4D4F] flex justify-center items-center hover:bg-[#FF4D4F] hover:text-white transition-all shadow-sm"
                                                        >
                                                            <i className="fa-solid fa-trash text-[14px]"></i>
                                                        </button>
                                                    </PermissionGate>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-[#A3A3A3] text-sm">
                                        لا يوجد أدوار مسجلة حالياً.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* pagination controls */}
                {pagination && pagination.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2.5 mt-6" dir="rtl">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="w-9 h-9 rounded-full border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:bg-brand-main hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent"
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
                            className="w-9 h-9 rounded-full border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:bg-brand-main hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                            <ChevronLeft className="size-4" />
                        </button>
                    </div>
                )}
            </div>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[32px] border-0" dir="rtl">
                    {categoryToDelete && (
                        <div className="p-8 flex flex-col items-center text-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-[#FFEBEB] text-[#FF4D4F] flex items-center justify-center shadow-inner mt-4">
                                <i className="fa-solid fa-trash text-[40px]"></i>
                            </div>

                            <div className="flex flex-col gap-2">
                                <h3 className="text-[22px] font-black text-black">
                                    هل أنت متأكد من حذف الدور؟
                                </h3>
                                <p className="text-[18px] font-bold text-[#FF4D4F] bg-[#FFEBEB] px-4 py-1.5 rounded-full inline-block mx-auto">
                                    {categoryToDelete.title_trans || categoryToDelete.title_ar || categoryToDelete.name}
                                </p>
                            </div>

                            <p className="text-[15px] font-medium text-[#737373]">
                                هذا الإجراء لا يمكن التراجع عنه بعد الحذف! سيتم فقدان كافة الصلاحيات المرتبطة بهذا الدور.
                            </p>

                            <div className="flex items-center gap-4 w-full mt-2">
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleteRolePending}
                                    className="flex-1 h-[54px] bg-[#FF4D4F] text-white rounded-[16px] font-bold text-[16px] hover:bg-[#E03E3E] transition-all shadow-lg shadow-[#FF4D4F]/25 flex items-center justify-center"
                                >
                                    {deleteRolePending ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        "تأكيـد الحـذف"
                                    )}
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={deleteRolePending}
                                    className="flex-1 h-[54px] bg-[#F5F5F5] text-[#737373] rounded-[16px] font-bold text-[16px] hover:bg-[#EEEEEE] transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}