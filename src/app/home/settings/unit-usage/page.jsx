"use client"
import EditTypeUnitDialog from '@/components/analysis/settings/unit-types/edit-type-unit-dialog';
import AddNewUsageDialog from '@/components/analysis/settings/unit-usage/add-new-usage-dialog';
import EditUsageUnitDialog from '@/components/analysis/settings/unit-usage/edit-usage-unit-dialog';
import Header from '@/components/home/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { axiosInstance } from '@/src/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, Pentagon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
export default function UnitUsagePage() {
  const [activeTab, setActiveTab] = useState("housing");
  const queryClient = useQueryClient();

  // get all unit types
  function getUnitUsages() {
    return axiosInstance(`/admin/unit-usages?contract_type=${activeTab}`);
  }
  const { data: unitUsages, isLoading: unitUsagesLoading } = useQuery({
    queryKey: ["unit-usages", activeTab],
    queryFn: getUnitUsages,
  })
  const data = unitUsages?.data?.data?.items;


  // delete unit type
  function deleteUnitUsage(id) {
    return axiosInstance.post(`/admin/unit-usages/${id}/delete`);
  }
  const { mutate: deleteUnitUsageMutate, isPending: deleteUnitUsagePending } = useMutation({
    mutationFn: deleteUnitUsage,
    onSuccess: (res) => {
      console.log(res);
      
      toast.success(res?.data?.message || "تم حذف نوع الوحدة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["unit-usages"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء حذف نوع الوحدة");
    }
  })



  return (
    <div className='p-6'>
      <Header page='welcome' title={"الإعـدادات"} isMain={false} first="الرئيــسية" firstURL="/" second='الإعـدادات' secondURL="/home/settings" third="انواع الوحدات" thirdURL="/home/settings/unit-types" />
      <div>
        <Tabs dir='rtl' defaultValue={activeTab} className="w-full">
          <div className='flex items-center justify-between mb-4'>
            <TabsList className="bg-transparent gap-4">
              <TabsTrigger value="housing" onClick={() => setActiveTab("housing")} className="data-[state=active]:bg-brand-hover data-[state=active]:text-white font-bold p-4 px-8 rounded-full gap-2 bg-gray-200"> <Pentagon className='w-4 h-4' />سكني</TabsTrigger>
              <TabsTrigger value="commercial" onClick={() => setActiveTab("commercial")} className="data-[state=active]:bg-brand-hover data-[state=active]:text-white font-bold p-4 px-8 rounded-full gap-2 bg-gray-200"> <Building2 className='w-4 h-4' />تجاري</TabsTrigger>
            </TabsList>
            <AddNewUsageDialog />
          </div >
          <TabsContent value="housing" className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {data?.map((item) => (
              <div className='bg-gray-200 rounded-[16px] border border-[#E4E4E4] p-4    transition-all group' key={item.id}>
                <h3>استخدام الوحدة</h3>
                <div className=' mt-4'>
                  <p>{item.name_ar}</p>
                  <div className='flex items-center justify-end gap-2 mt-4'>
                    <EditTypeUnitDialog unit={item} />
                    <Button disabled={deleteUnitUsagePending} onClick={() => deleteUnitUsageMutate(item.id)} className='bg-red-500/20 text-red-500 text-xs'>
                      حذف
                    </Button>
                  </div>

                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="commercial" className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {data?.map((item) => (
              <div className='bg-gray-200 rounded-[16px] border border-[#E4E4E4] p-4    transition-all group' key={item.id}>
                <h3>استخدام الوحدة</h3>
                <div className=' mt-4'>
                  <p>{item.name_ar}</p>
                  <div className='flex items-center justify-end  gap-2 mt-4'>
                    <EditUsageUnitDialog unit={item} />
                    <Button disabled={deleteUnitUsagePending} onClick={() => deleteUnitUsageMutate(item.id)} className='bg-red-500/20 text-red-500 text-xs'>
                      حذف
                    </Button>
                  </div>

                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

      </div>

    </div>
  )
}
