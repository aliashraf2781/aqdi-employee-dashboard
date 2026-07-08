
import Header from '@/components/home/Header';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import AddNewMessageForClientDialog from '@/components/analysis/settings/message-for-clients/add-message-for-client';
import DisplayMessageForClientDialog from '@/components/analysis/settings/message-for-clients/display-message-for-client';
export default function TermsPage() {

  return (
    <div className="min-h-screen p-6">
      <Header page='welcome' title={"الإعـدادات"} isMain={false} first="الرئيــسية" firstURL="/" second='الإعـدادات' secondURL="/home/settings" third="رســائل توضيحية للملاك" thirdURL="/home/settings/message-for-clients" />

      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold'>رســائل توضيحية للمــلاك</h2>
        <AddNewMessageForClientDialog />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
        {["نــوع الوثيــقة", "رقم وثيــقة الملكية", "تــاريخ وثيــقة الملكية", "نوع الوحده"].map((item, index) => (
          <div className='bg-gray-200 rounded-[16px] border border-[#E4E4E4] p-4    transition-all group' key={index}>
            <div className='flex items-center justify-between'>
              <h3>قسم الصك</h3>
              <div className='flex items-center gap-2'>
                <Switch dir='ltr' checked={true} />
                <AddNewMessageForClientDialog isEdit={true} />
              </div>
            </div>
            <div className=' mt-4 flex items-center justify-between'>
              <p>{item}</p>
              <DisplayMessageForClientDialog />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
