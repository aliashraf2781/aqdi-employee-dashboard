"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { ImageIcon, X } from "lucide-react";

export default function ViewInstructionImageDialog({ item, open, onOpenChange }) {
  if (!item) return null;

  const files = item.files ?? [];

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
              عرض {item.description}
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

        <div className="p-6 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
          {files.length > 0 ? (
            files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-4 bg-[#FAFAFA] rounded-[14px] border border-[#F0F0F0]"
              >
                <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center shrink-0">
                  <ImageIcon className="size-6 text-white" />
                </div>
                <div className="text-right flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-black">{file.name}</p>
                  <p className="text-[12px] text-[#A3A3A3]">{file.type}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-[#A3A3A3] py-8">لا توجد صور لهذا القسم</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
