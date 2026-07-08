"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/src/utils/axios";
import { toast } from "sonner";

const menuContentClass =
    "w-[210px] rounded-[18px] border border-[#E8E8E8] bg-white p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]";

const itemBaseClass =
    "flex items-center gap-3 w-full rounded-[14px] px-3 py-3.5 cursor-pointer outline-none";

export default function ReturnOrderActionsMenu({
    order,
    queryKey = ["returnOrders"],
    onReturnRequest,
    showReturnRequest = true,
}) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const queryClient = useQueryClient();

    const { mutate: deleteOrder, isPending: isDeleting } = useMutation({
        mutationFn: () => axiosInstance.post(`/admin/orders/${order.id}/delete`),
        onSuccess: (res) => {
            toast.success(res?.data?.message || "تم حذف الطلب بنجاح");
            queryClient.invalidateQueries({ queryKey });
            setDeleteOpen(false);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "حدث خطأ أثناء حذف الطلب");
        },
    });

    const handleReturnRequest = (e) => {
        e.stopPropagation();
        onReturnRequest?.(order);
    };

    return (
        <>
            <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F5F5F5] text-[#4D4D4D] hover:bg-[#EBEBEB] transition-all"
                        aria-label="إجراءات الطلب"
                    >
                        <i className="fa-solid fa-ellipsis-vertical text-[14px]" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    sideOffset={6}
                    className={menuContentClass}
                    onClick={(e) => e.stopPropagation()}
                >
                    {showReturnRequest ? (
                        <DropdownMenuItem
                            className={`${itemBaseClass} hover:bg-[#F9F9F9] focus:bg-[#F9F9F9]`}
                            onClick={handleReturnRequest}
                        >
                            <span className="text-[18px] leading-none shrink-0" aria-hidden>
                                😩
                            </span>
                            <span className="flex-1 text-center text-[14px] font-medium text-black">
                                طلب إسترجاع
                            </span>
                            <ChevronLeft className="size-3.5 shrink-0 text-[#0c6055]" strokeWidth={2.5} />
                        </DropdownMenuItem>
                    ) : null}

                    <DropdownMenuItem
                        className={`${itemBaseClass} hover:bg-[#FFF5F5] focus:bg-[#FFF5F5] text-[#E24444]`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteOpen(true);
                        }}
                    >
                        <Trash2 className="size-4 shrink-0 text-[#E24444]" strokeWidth={2} />
                        <span className="flex-1 text-center text-[14px] font-medium text-[#E24444]">
                            حذف الطلب
                        </span>
                        <ChevronLeft className="size-3.5 shrink-0 text-[#E24444]" strokeWidth={2.5} />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent dir="rtl" className="rounded-[20px] max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[18px] font-bold text-black text-right">
                            حذف الطلب
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[14px] text-[#737373] text-right">
                            هل أنت متأكد من حذف الطلب{" "}
                            <span className="font-bold text-black">{order?.uuid}</span>؟ لا يمكن
                            التراجع عن هذا الإجراء.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row-reverse gap-2 sm:gap-2">
                        <AlertDialogCancel
                            disabled={isDeleting}
                            className="rounded-full border-[#E4E4E4] mt-0"
                        >
                            إلغاء
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isDeleting}
                            onClick={(e) => {
                                e.preventDefault();
                                deleteOrder();
                            }}
                            className="rounded-full bg-[#E24444] hover:bg-[#d63c3c] text-white"
                        >
                            {isDeleting ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                "تأكيد الحذف"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
