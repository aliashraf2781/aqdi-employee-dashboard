"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Eye, ImageIcon, Plus, Share2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function EditInstructionImageDialog({ item, open, onOpenChange }) {
  const [files, setFiles] = useState(item?.files ?? []);

  useEffect(() => {
    if (open && item) {
      setFiles(item.files ?? []);
    }
  }, [open, item]);

  if (!item) return null;

  const handleDelete = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast.success("تم حذف الصورة");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeButton={false}
        className="max-w-lg p-0 overflow-hidden rounded-[24px] border-0"
        dir="rtl"
      >
        <DialogHeader className="p-6 pb-4 border-b border-[#F5F5F5]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[16px] font-black text-black leading-snug text-right flex-1">
              تعديل {item.description}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="shrink-0 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 flex flex-col gap-5">
          <div className="bg-[#F5F5F5] rounded-[20px] p-8 flex flex-col items-center justify-center gap-3 border border-dashed border-[#E0E0E0] cursor-pointer hover:bg-[#EEEEEE] transition-colors">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
              <ImageIcon className="size-7 text-white" />
            </div>
            <p className="text-[14px] font-bold text-black">تحميل الصورة</p>
            <p className="text-[12px] text-[#A3A3A3]">png</p>
          </div>

          <div className="flex flex-col gap-3">
            {files.length > 0 ? (
              files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-3 p-3 bg-[#FAFAFA] rounded-[14px] border border-[#F0F0F0]"
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-white border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:text-brand-main transition-colors"
                      onClick={() => toast.info("معاينة الصورة")}
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-white border border-[#E4E4E4] flex items-center justify-center text-[#A3A3A3] hover:text-[#FF4D4F] transition-colors"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                    <div className="text-right min-w-0">
                      <p className="text-[13px] font-bold text-black truncate">{file.name}</p>
                      <p className="text-[11px] text-[#A3A3A3]">{file.type}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center shrink-0">
                      <ImageIcon className="size-5 text-white" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[13px] text-[#A3A3A3] py-4">لا توجد صور مرفقة</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              className="flex flex-col items-center gap-1 text-[#737373] hover:text-brand-main transition-colors"
              onClick={() => toast.info("مشاركة")}
            >
              <Share2 className="size-5" />
              <span className="text-[11px] font-medium">مشاركة</span>
            </button>

            <Button
              type="button"
              className="bg-brand-hover text-white h-11 rounded-full font-bold px-8 flex items-center gap-2"
              onClick={() => {
                toast.success("تمت الإضافة");
                onOpenChange(false);
              }}
            >
              <Plus className="size-4" />
              إضافة
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
