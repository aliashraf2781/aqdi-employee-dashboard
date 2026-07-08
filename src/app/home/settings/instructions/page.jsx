"use client";

import { useMemo, useState } from "react";
import Header from "@/components/home/Header";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { INSTRUCTION_IMAGE_SECTIONS } from "@/components/analysis/settings/instructions/instruction-images-data";
import InstructionImageCard from "@/components/analysis/settings/instructions/instruction-image-card";
import EditInstructionImageDialog from "@/components/analysis/settings/instructions/edit-instruction-image-dialog";
import ViewInstructionImageDialog from "@/components/analysis/settings/instructions/view-instruction-image-dialog";

export default function InstructionsPage() {
  const [enabledMap, setEnabledMap] = useState(() =>
    Object.fromEntries(INSTRUCTION_IMAGE_SECTIONS.map((s) => [s.id, s.enabled]))
  );
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const handleToggle = (id, checked) => {
    setEnabledMap((prev) => ({ ...prev, [id]: checked }));
    toast.success(checked ? "تم تفعيل القسم" : "تم تعطيل القسم");
  };

  const editDialogItem = useMemo(
    () => INSTRUCTION_IMAGE_SECTIONS.find((s) => s.id === editItem?.id) ?? editItem,
    [editItem]
  );

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6" dir="rtl">
      <Header
        page="welcome"
        title="صور تعليمية أو إعلانية"
        isMain={false}
        first="الرئيــسية"
        firstURL="/"
        second="الإعـدادات"
        secondURL="/home/settings"
        third="قسم التعليمات"
        thirdURL="/home/settings/instructions"
      />

      {/* <div className="flex items-center justify-between gap-4 flex-wrap mt-2">
        <h3 className="text-[15px] font-bold text-[#424242]">صور تعليمية أو إعلانية :</h3>
        <Button
          type="button"
          className="bg-brand-hover text-white h-12 rounded-full font-bold px-6 flex items-center gap-2 shadow-lg shadow-brand-main/20 hover:scale-105 active:scale-95 transition-all"
          onClick={() => toast.info("إضافة صورة تعليمية جديدة")}
        >
          <Plus className="size-4" />
          <span>إضافة صورة تعليمية جديدة</span>
        </Button>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {INSTRUCTION_IMAGE_SECTIONS.map((item) => (
          <InstructionImageCard
            key={item.id}
            item={item}
            enabled={enabledMap[item.id] ?? false}
            onToggle={handleToggle}
            onEdit={setEditItem}
            onView={setViewItem}
          />
        ))}
      </div>

      <EditInstructionImageDialog
        item={editDialogItem}
        open={Boolean(editItem)}
        onOpenChange={(open) => {
          if (!open) setEditItem(null);
        }}
      />

      <ViewInstructionImageDialog
        item={viewItem}
        open={Boolean(viewItem)}
        onOpenChange={(open) => {
          if (!open) setViewItem(null);
        }}
      />
    </div>
  );
}
