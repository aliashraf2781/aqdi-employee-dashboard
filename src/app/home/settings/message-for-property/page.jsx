"use client"
import React from 'react';
import Header from '@/components/home/Header';
import { Button } from '@/components/ui/button';
import AddNewMessageForPropertyDialog from '@/components/analysis/settings/message-for-property/add-message-for-property';
import DisplayMessageForPropertyDialog from '@/components/analysis/settings/message-for-property/display-message-for-property';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/src/utils/axios';
import { toast } from 'sonner';
import Loader from '@/components/home/loader';
import { Trash2, Loader2 } from 'lucide-react';

export default function PropertyTermsPage() {
  const queryClient = useQueryClient();

  // Fetch property message alerts
  const { data: alertsResponse, isLoading } = useQuery({
    queryKey: ["message-alerts-property"],
    queryFn: () => axiosInstance.get("/admin/message-alerts/property").then(res => res.data)
  });

  const alerts = alertsResponse?.data?.items || alertsResponse?.data || [];

  // Delete mutation supporting both POST and DELETE endpoints
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      try {
        return await axiosInstance.post(`/admin/message-alerts/property/${id}/delete`);
      } catch (e) {
        if (e.response?.status === 404 || e.response?.status === 405) {
          return await axiosInstance.delete(`/admin/message-alerts/property/${id}`);
        }
        throw e;
      }
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message || "تم حذف الرسالة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["message-alerts-property"] });
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
        third="رســائل توضيحية للعقــار" 
        thirdURL="/home/settings/message-for-property" 
      />

      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold'>رســائل توضيحية للعقــار</h2>
        <AddNewMessageForPropertyDialog isEdit={false} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
        {alerts?.map((item) => (
          <div className='bg-gray-200 rounded-[16px] border border-[#E4E4E4] p-4 transition-all group' key={item.id}>
            <div className='flex items-center justify-between'>
              <h3>{item.section?.name_ar || 'بدون قسم'}</h3>
              <div className='flex items-center gap-2'>
                <AddNewMessageForPropertyDialog isEdit={true} messageAlert={item} />
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
              <DisplayMessageForPropertyDialog messageAlert={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
