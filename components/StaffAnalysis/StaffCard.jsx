import React from 'react'
import logo from '@/public/images/logo.svg'
import Image from 'next/image'
import defaultUser from '@/public/images/defaultUser.jpg'


export default function StaffCard({ staff }) {
    return (
        <div className="bg-white rounded-[32px] border border-[#E4E4E4] p-8 flex flex-col items-center gap-6 relative overflow-hidden hover:shadow-xl transition-all group">
            <div className="absolute top-6 right-6 flex flex-col items-center gap-1">
                <span className="text-[18px] font-bold text-black font-sans">#{staff?.rank || 1}</span>
                <div className="text-[#FFC107] text-[12px]">
                    <i className="fa-solid fa-star"></i>
                </div>
            </div>
            
            <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-[#fcfcfc] border border-[#eee] flex items-center justify-center p-2 pt-2.5">
                <Image src={logo} alt="Logo" width={24} height={24} className="object-contain" />
            </div>

            <div className="flex flex-col items-center gap-4 pt-4">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5F5F5] shadow-inner transition-all group-hover:scale-105 group-hover:border-brand-main">
                    <Image
                        src={staff?.image || defaultUser}
                        alt={staff?.name || "Staff"}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="text-center">
                    <h3 className="text-[20px] font-bold text-black mb-1.5">{staff?.name || "ريـــان التركي"}</h3>
                    <div className="px-4 py-1 bg-brand-main/5 text-brand-main rounded-full text-[12px] font-medium border border-brand-main/10 inline-block">
                        {staff?.role || "admin"}
                    </div>
                </div>

                <div className="w-full mt-2 p-5 bg-[#F9F9F9] rounded-[24px] border border-[#EEEEEE] flex flex-col items-center gap-1">
                    <h2 className="text-[28px] font-bold text-black font-sans leading-none">{staff?.count || "410"}</h2>
                    <p className="text-[13px] text-[#A3A3A3] font-medium">{staff?.label || "عدد العقود المكتسبة"}</p>
                </div>
            </div>
        </div>
    );
}