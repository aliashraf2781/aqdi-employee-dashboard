"use client"
import React from 'react';
import Header from '@/components/home/Header';
import { Button } from '@/components/ui/button';
import AddNewMessageForEmployeeDialog from '@/components/analysis/settings/message-for-employees/add-message-for-employee';
import DisplayMessageForEmployeeDialog from '@/components/analysis/settings/message-for-employees/display-message-for-employee';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/src/utils/axios';
import { toast } from 'sonner';
import Loader from '@/components/home/loader';
import { Trash2, Loader2 } from 'lucide-react';

export default function EmployeeTermsPage() {
  const queryClient = useQueryClient();

  // Fetch employee message alerts
  const { data: alertsResponse, isLoading } = useQuery({
    queryKey: ["message-alerts-employee"],
    queryFn: () => axiosInstance.get("/admin/message-alerts/employee").then(res => res.data)
  });

  const alerts = alertsResponse?.data?.items || alertsResponse?.data || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.post(`/admin/message-alerts/employee/${id}/delete`),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "تم حذف الرسالة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["message-alerts-employee"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حذف الرسالة");
    }
  });

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <Header 
        page='welcome' 
        title={"الإعـدادات"} 
        isMain={false} 
        first="الرئيــسية" 
        firstURL="/" 
        second='الإعـدادات' 
        secondURL="/home/settings" 
        third="رســائل توضيحية للموظفيــن" 
        thirdURL="/home/settings/message-for-employee" 
      />

      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold'>رســائل توضيحية للموظفيــن</h2>
        <AddNewMessageForEmployeeDialog isEdit={false} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
        {alerts?.map((item) => (
          <div className='bg-gray-200 rounded-[16px] border border-[#E4E4E4] p-4 transition-all group' key={item.id}>
            <div className='flex items-center justify-between'>
              <h3>{item.section?.name_ar || 'بدون قسم'}</h3>
              <div className='flex items-center gap-2'>
                <AddNewMessageForEmployeeDialog isEdit={true} messageAlert={item} />
                <Button 
                  disabled={deleteMutation.isPending} 
                  onClick={() => deleteMutation.mutate(item.id)} 
                  className='bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg h-9 w-9 p-0 flex items-center justify-center'
                >
                  {deleteMutation.isPending && deleteMutation.variables === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </Button>
              </div>
            </div>
            <div className=' mt-4 flex items-center justify-between'>
              <p>{item?.message || 'بدون بند'}</p>
              <DisplayMessageForEmployeeDialog messageAlert={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
