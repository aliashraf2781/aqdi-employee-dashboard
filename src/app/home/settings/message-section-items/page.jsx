"use client"
import React, { useState } from 'react';
import Header from '@/components/home/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, Home, Trash2, Loader2 } from 'lucide-react';
import AddNewSectionItemDialog from '@/components/analysis/settings/message-section-items/add-section-item-dialog';
import { axiosInstance } from '@/src/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Loader from '@/components/home/loader';

export default function MessageSectionItemsPage() {
  const [activeTab, setActiveTab] = useState("client");
  const queryClient = useQueryClient();

  // Fetch section items based on current active tab type
  const { data: itemsResponse, isLoading } = useQuery({
    queryKey: ["message-alert-section-items", activeTab],
    queryFn: () => axiosInstance.get(`/admin/message-alert-section-items?type=${activeTab}`).then(res => res.data)
  });

  const items = itemsResponse?.data?.items || itemsResponse?.data || [];

  // Delete section item mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      try {
        return await axiosInstance.post(`/admin/message-alert-section-items/${id}/delete`);
      } catch (e) {
        if (e.response?.status === 404 || e.response?.status === 405) {
          return await axiosInstance.delete(`/admin/message-alert-section-items/${id}`);
        }
        throw e;
      }
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message || "تم حذف البند بنجاح");
      queryClient.invalidateQueries({ queryKey: ["message-alert-section-items"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حذف البند");
    }
  });

  return (
    <div className='p-6' dir="rtl">
      <Header 
        page='welcome' 
        title={"الإعـدادات"} 
        isMain={false} 
        first="الرئيــسية" 
        firstURL="/" 
        second='الإعـدادات' 
        secondURL="/home/settings" 
        third="بنود أقسام الرسائل" 
        thirdURL="/home/settings/message-section-items" 
      />

      <div className="mt-6">
        <Tabs dir='rtl' value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className='flex items-center justify-between mb-4 border-b border-[#E4E4E4] pb-4'>
            <TabsList className="bg-transparent gap-4 h-auto p-0">
              <TabsTrigger 
                value="client" 
                className="data-[state=active]:bg-brand-hover data-[state=active]:text-white font-bold p-4 px-8 rounded-full gap-2 bg-gray-200 text-[#616161]"
              > 
                <User className='w-4 h-4' />عميل
              </TabsTrigger>
              <TabsTrigger 
                value="employee" 
                className="data-[state=active]:bg-brand-hover data-[state=active]:text-white font-bold p-4 px-8 rounded-full gap-2 bg-gray-200 text-[#616161]"
              > 
                <Users className='w-4 h-4' />موظف
              </TabsTrigger>
              <TabsTrigger 
                value="property" 
                className="data-[state=active]:bg-brand-hover data-[state=active]:text-white font-bold p-4 px-8 rounded-full gap-2 bg-gray-200 text-[#616161]"
              > 
                <Home className='w-4 h-4' />عقار
              </TabsTrigger>
            </TabsList>
            <AddNewSectionItemDialog isEdit={false} defaultType={activeTab} />
          </div >

          {isLoading ? (
            <div className="py-12 flex justify-center"><Loader /></div>
          ) : (
            <>
              <TabsContent value="client" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div className='bg-gray-200 rounded-[16px] border border-[#E4E4E4] p-4 transition-all group' key={item.id}>
                    <h3 className="mt-4">البند</h3>
                    <div className='mt-2'>
                      <p className="font-bold text-black">{item.name_ar}</p>
                    </div>
                    <div className='flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[#D4D4D4]'>
                      <AddNewSectionItemDialog isEdit={true} item={item} defaultType="client" />
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
                ))}
              </TabsContent>

              <TabsContent value="employee" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div className='bg-gray-200 rounded-[16px] border border-[#E4E4E4] p-4 transition-all group' key={item.id}>
                    <h3 className="mt-4">البند</h3>
                    <div className='mt-2'>
                      <p className="font-bold text-black">{item.name_ar}</p>
                    </div>
                    <div className='flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[#D4D4D4]'>
                      <AddNewSectionItemDialog isEdit={true} item={item} defaultType="employee" />
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
                ))}
              </TabsContent>

              <TabsContent value="property" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div className='bg-gray-200 rounded-[16px] border border-[#E4E4E4] p-4 transition-all group' key={item.id}>
                    <h3 className="mt-4">البند</h3>
                    <div className='mt-2'>
                      <p className="font-bold text-black">{item.name_ar}</p>
                    </div>
                    <div className='flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[#D4D4D4]'>
                      <AddNewSectionItemDialog isEdit={true} item={item} defaultType="property" />
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
                ))}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
