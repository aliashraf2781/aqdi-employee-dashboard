"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Maximize2,
  Minus,
  Plus,
  Share2,
  UserPlus,
  X,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function isPdfUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.split("?")[0].toLowerCase().endsWith(".pdf");
}

export function resolveAgencyDocumentUrl(summary) {
  if (!summary) return null;
  const raw = summary.copy_of_the_authorization_or_agency;
  if (!raw) return null;
  if (typeof raw === "string") return raw.trim() || null;
  if (typeof raw === "object") {
    return raw.url || raw.path || raw.full_url || raw.src || null;
  }
  return null;
}

export default function AgencyDocumentViewerDialog({
  open,
  onOpenChange,
  documentUrl,
  title = "صورة الوكالة",
}) {
  const [zoom, setZoom] = useState(1);
  const isPdf = isPdfUrl(documentUrl);

  useEffect(() => {
    if (open) setZoom(1);
  }, [open, documentUrl]);

  const handleShare = useCallback(async () => {
    if (!documentUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({ title, url: documentUrl });
        return;
      }
    } catch {
      /* user cancelled or unsupported */
    }
    window.open(documentUrl, "_blank", "noopener,noreferrer");
  }, [documentUrl, title]);

  const handleFullscreen = () => {
    if (!documentUrl) return;
    window.open(documentUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeButton={false}
        className="sm:max-w-[min(920px,calc(100vw-32px))] p-0 gap-0 overflow-hidden rounded-[28px] border-0 bg-[#E8E8E8]"
        dir="rtl"
      >
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EBEBEB]">
          <h2 className="text-[18px] font-bold text-black">{title}</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#A3A3A3] hover:bg-[#F5F5F5] hover:text-[#E24444] transition-colors"
            aria-label="إغلاق"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="relative bg-[#E8E8E8] min-h-[min(70vh,640px)] flex items-center justify-center p-6">
          {documentUrl ? (
            <>
              <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
                <ViewerToolButton
                  icon={Share2}
                  label="مشاركة"
                  onClick={handleShare}
                />
                <ViewerToolButton
                  icon={Minus}
                  label="تصغير"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  disabled={isPdf}
                />
                <ViewerToolButton
                  icon={Maximize2}
                  label="ملء الشاشة"
                  onClick={handleFullscreen}
                />
                <ViewerToolButton
                  icon={Plus}
                  label="تكبير"
                  onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
                  disabled={isPdf}
                />
              </div>

              <div className="w-full max-w-[min(720px,100%)] max-h-[min(68vh,600px)] overflow-auto rounded-xl bg-white shadow-lg">
                {isPdf ? (
                  <iframe
                    src={documentUrl}
                    title={title}
                    className="w-full min-h-[min(68vh,600px)] rounded-xl border-0"
                  />
                ) : (
                  <div
                    className="flex items-center justify-center p-4 transition-transform duration-200"
                    style={{ transform: `scale(${zoom})` }}
                  >
                    <Image
                      src={documentUrl}
                      alt={title}
                      width={640}
                      height={900}
                      className="w-auto h-auto max-w-full max-h-[min(64vh,560px)] object-contain"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-[15px] text-[#737373]">لا يوجد ملف وكالة مرفق</p>
          )}
        </div>

        <div className="px-6 py-5 bg-white border-t border-[#EBEBEB] flex justify-center">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="min-w-[200px] h-[52px] bg-brand-hover text-white rounded-xl font-bold text-[16px] hover:bg-brand-hover/90 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ViewerToolButton({ icon: Icon, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="w-11 h-11 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shadow-lg hover:bg-black transition-colors disabled:opacity-40 disabled:pointer-events-none"
    >
      <Icon className="size-5" strokeWidth={2} />
    </button>
  );
}

export function LegalAgentStatusBadge() {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F0E6FF] text-[#7C3AED] text-[13px] font-bold whitespace-nowrap">
      <UserPlus className="size-4 shrink-0" />
      يوجد وكيل للمالك
    </span>
  );
}
