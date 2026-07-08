import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { useState } from 'react'
import { BiSolidCopy } from 'react-icons/bi'
import { IoLogoWhatsapp } from 'react-icons/io'
import { LuSend, LuX } from 'react-icons/lu'
import { toast } from 'sonner'

const NotClearAgent = ({ setOpen }) => {
  const [text, setText] = useState(`رقم الطلب : 28387

عميلنا العزيز،
يوجد خطأ في إحدى بيانات وكيل المالك الموضحة أدناه:
	•	رقم الهوية: 1002999290
	•	تاريخ الميلاد: 1990-12-06
	•	رقم الجوال: 597500013

نرجو تزويدنا بالبيانات الصحيحة هنا في المحادثة ليتمكن فريقنا من استكمال الإجراء`)
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between pb-4 border-b border-gray-200'>
        <p className='text-black font-semibold'>بيانات الوكيل غير واضحة</p>
        <Button variant="ghost" onClick={() => setOpen(false)}><LuX size={16} /></Button>
      </div>

      <textarea value={text} onChange={(e) => setText((prev) => prev + "\n" + e.target.value)} dir='rtl' className='min-h-[35vh] text-right bg-gray-200 p-4 space-y-4 text-xs font-semibold text-black leading-6 focus-visible:ring-primary placeholder:text-sm'>
      </textarea>

      {/* buttons */}
      <div className='flex flex-col justify-center items-center gap-4'>
        <Button onClick={() => { navigator.clipboard.writeText("597500013"); toast.success("تم النسخ بنجاح") }} variant="secondary" className='flex items-center gap-2 w-fit' >597500013 <BiSolidCopy size={16} /> <IoLogoWhatsapp size={16} className='text-green-500' /></Button>
        <Button  variant="default" className='text-white w-fit' >إرسال <LuSend size={16} /></Button>
      </div>
    </div>
  )
}

export default NotClearAgent