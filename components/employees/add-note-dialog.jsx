"use client"
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger
} from "@/components/ui/dialog";
import { FilePenLine, Plus, X } from 'lucide-react';
import { useState } from 'react';
import AddNoteForm from './add-note-form';
export default function AddNoteDialog({ employee }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog dir='rtl' open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="bg-black text-white">
          <FilePenLine />
          إضافة ملاحظة
        </Button>
      </DialogTrigger>
      <DialogContent closeButton={false} className="max-w-3xl">
        <DialogHeader>
          <div dir='rtl' className='flex items-center justify-between  border-b pb-4'>
            {/* header and close button */}
            <h2 className='text-xl font-bold'>إضافة ملاحظة جديدة</h2>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              <X className='w-4 h-4' />
            </Button>
          </div>
          <AddNoteForm employee={employee} onSuccess={() => setOpen(false)} />

        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
