import React from 'react'
import Image from 'next/image'
import { Clock } from 'lucide-react'

export default function CommentCard({ comment }) {
  return (
    <div className='bg-white rounded-xl p-4 border border-[#F0F0F0] shadow-sm flex flex-col gap-3.5' dir="rtl">
      {/* User Info Row */}
      <div className='flex items-center justify-between w-full'>
        {/* Right: User Avatar and Name */}
        <div className='flex items-center gap-2.5'>
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <Image
              src={"/images/defaultUser.jpg"}
              alt="User"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
          <div className='text-right'>
            <h4 className='text-[14px] font-bold text-black leading-none'>{comment?.employee_name}</h4>
            <span className='text-[11px] text-[#A3A3A3] font-medium mt-1 inline-block'>{comment?.employee_role}</span>
          </div>
        </div>

        {/* Left: Time */}
        <div className='flex items-center gap-1.5 text-[#A3A3A3] text-[11px] font-medium'>
          <div className='w-[20px] h-[20px] rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#616161]'>
            <Clock size={11} strokeWidth={2.5} />
          </div>
          <span>{comment?.created_at_human}</span>
        </div>
      </div>

      {/* Comment Content */}
      <div className='text-right px-0.5'>
        <p className='text-[13px] font-bold text-[#333] leading-relaxed'>
          {comment?.comment}
        </p>
      </div>
    </div>
  )
}
