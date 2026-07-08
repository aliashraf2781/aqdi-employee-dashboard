"use client"
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger
} from "@/components/ui/dialog";
import { Edit, Plus, X } from 'lucide-react';
import { useState } from 'react';
import AddEmployeeForm from './add-employee-form';
export default function AddNewEmployeeDialog({ isEdit = false, employee, table = false }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog dir='rtl' open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {isEdit ? (
          <Button className={`rounded-full flex items-center justify-center shadow-none border-0 ${table ? "w-9 h-9 bg-[#E6FFE6] text-[#10B981] hover:bg-[#10B981] hover:text-white p-0" : "text-white"}`} size={table ? "icon" : "default"}>
            <Edit className='size-4' />
            {!table && 'تعديل'}
          </Button>
        ) : (
          <Button className="bg-brand-hover hover:bg-brand-hover/90 text-white h-12 rounded-full font-bold px-6 gap-2 whitespace-nowrap">
            + إضافة موظف
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent closeButton={false} className="max-w-3xl h-[95vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <div dir='rtl' className='flex items-center justify-between  border-b pb-4'>
            {/* header and close button */}
            <h2 className='text-xl font-bold'>{isEdit ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}</h2>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              <X className='w-4 h-4' />
            </Button>
          </div>

          <AddEmployeeForm isEdit={isEdit} employee={employee} onSuccess={() => setOpen(false)} />

        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
