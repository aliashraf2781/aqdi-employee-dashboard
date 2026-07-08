'use client';

import AddNewCityDialog from '@/components/analysis/settings/cities/add-new-city-dialog';
import DeleteCityDialog from '@/components/analysis/settings/cities/delete-city-dialog';
import EditCityDialog from '@/components/analysis/settings/cities/edit-city-dialog';
import Header from '@/components/home/Header';
import { axiosInstance } from '@/src/utils/axios';
import { useQuery } from '@tanstack/react-query';
// app/editor/page.jsx  (or pages/editor.jsx for Pages Router)


export default function CitiesPage() {

  const tableHeaders = [
    "اسم المدينة",
    "المنطقة",
    "الإجراءات",
  ];

  function getCities() {
    return axiosInstance.get("/admin/cities");
  }

  const { data: cities, isLoading: citiesLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
  })


  const data = cities?.data?.data?.items
  console.log(data)


  return (
    <div className="min-h-screen p-6">
      <Header page='welcome' title={"الإعـدادات"} isMain={false} first="الرئيــسية" firstURL="/" second='الإعـدادات' secondURL="/home/settings" third="المدن" thirdURL="/home/settings/cities" />

      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold'>المدن</h2>
        <AddNewCityDialog />
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
                  <span className="text-black text-[13px]">{row?.regions?.name_ar}</span>
                </td>

                <td className="p-[15px_20px]">
                  <div className='flex items-center gap-2'>
                    <EditCityDialog city={row} />
                    <DeleteCityDialog city={row} />
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
