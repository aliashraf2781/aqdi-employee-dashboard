'use client';

import AddNewRegionDialog from '@/components/analysis/settings/regions/add-new-region-dialog';
import DeleteRegionDialog from '@/components/analysis/settings/regions/delete-region-dialog';
import EditRegionDialog from '@/components/analysis/settings/regions/edit-region-dialog';
import Header from '@/components/home/Header';
import { axiosInstance } from '@/src/utils/axios';
import { useQuery } from '@tanstack/react-query';
// app/editor/page.jsx  (or pages/editor.jsx for Pages Router)


export default function RegionsPage() {

  const tableHeaders = [
    "اسم المنطقه",
    "الإجراءات",
  ];

  function getRegions() {
    return axiosInstance.get("/admin/regions");
  }

  const { data: regions, isLoading: regionsLoading } = useQuery({
    queryKey: ["regions"],
    queryFn: getRegions,
  })


  const data = regions?.data?.data?.items
  console.log(data)


  return (
    <div className="min-h-screen p-6">
      <Header page='welcome' title={"الإعـدادات"} isMain={false} first="الرئيــسية" firstURL="/" second='الإعـدادات' secondURL="/home/settings" third="المناطق" thirdURL="/home/settings/regions" />

      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold'>المناطق</h2>
        <AddNewRegionDialog />
      </div>

      <div className="w-full overflow-x-auto bg-white rounded-[24px] border border-[#E4E4E4] mt-4 shadow-sm">
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
            {data?.map((row) => (
              <tr key={row.id} className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#fafafa] transition-all">
                <td className="p-[15px_20px]">
                  <span className="text-black text-[13px]">{row?.name_ar}</span>
                </td>

                <td className="p-[15px_20px]">
                  <div className='flex items-center gap-2'>
                    <EditRegionDialog region={row} />
                    <DeleteRegionDialog region={row} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
